import { $, type ShellPromise } from "bun";
import { arqcCommand } from "./arqcCommand";

interface CommonBackupActivityJSONFields {
	// Note: `"aborted"` may still be `false` for an aborted activity when the post-backup script is running.
	aborted: boolean;
	activityLogPath: string;
	backupPlanDbId: number;
	backupSetUUID: string;
	countOfBytes: number;
	countOfBytesUploaded: number;
	countOfFiles: number;
	countOfFilesUploaded: number;
	createdTime: number;
	dataVersion: number;
	errorCount: number;
	finishedTime: number;
	subType: string;
	type: string;
	updatedTime: number;
	uuid: string;
}
export interface InProgressBackupActivityJSON
	extends CommonBackupActivityJSONFields {
	// We'd use `Exclude<string, "Idle">`, but that is currently treated as `string` in TypeScript
	message: string;
}

export interface FinishedBackupActivityJSON
	extends CommonBackupActivityJSONFields {
	message: "Idle";
	abortReason?: string;
	totalBytes: 0;
	totalFiles: 0;
}

// Note: this should be `|` rather than `&`, but this is `&` due to TypeScript
// limitations.
//
// This means that `if (backupActivityJSON.message === "Idle")` unfortunately
// cannot type narrow the type of backupActivityJSON from `BackupActivityJSON`
// to `FinishedBackupActivityJSON` inside the `if` block where the condition is
// true. We provide the `backupActivityJSONAsFinished(…)` function for this.
export type BackupActivityJSON = InProgressBackupActivityJSON &
	FinishedBackupActivityJSON;

// Applies a heuristic to return `FinishedBackupActivityJSON` if and only if the backup has finished.
// Current heuristic: check if the `"message"` field is `"Idle"`.
export function backupActivityJSONAsFinished(
	backupActivityJSON: BackupActivityJSON,
): FinishedBackupActivityJSON | null {
	if (backupActivityJSON.message === "Idle") {
		return backupActivityJSON as FinishedBackupActivityJSON;
	}
	return null;
}

export interface ArqBackupPlanConfig {
	backupSetUUID: string;
	name?: string;
	storageLocation?: string;
}

export class ArqBackupPlan {
	constructor(public config: ArqBackupPlanConfig) {}

	#runSimpleCommand(commandName: string): ShellPromise {
		return $`${arqcCommand.path} ${commandName} ${this.config.backupSetUUID}`;
	}

	async latestBackupActivityJSON(): Promise<BackupActivityJSON> {
		return await this.#runSimpleCommand("latestBackupActivityJSON").json();
	}

	async latestBackupActivityLog(): Promise<string> {
		return await this.#runSimpleCommand("latestBackupActivityLog").text();
	}

	async wasLatestBackupSuccessful(): Promise<boolean> {
		const json = await this.latestBackupActivityJSON();
		return json.errorCount === 0 && !json.aborted;
	}

	async start() {
		await this.#runSimpleCommand("startBackupPlan");
	}

	async stop() {
		await this.#runSimpleCommand("stopBackupPlan");
	}
}
