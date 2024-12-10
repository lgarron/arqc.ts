import { $, type ShellPromise } from "bun";
import { arqcCommand } from "./arqcCommand";

export interface BackupActivityJSON {
	countOfFilesUploaded: number;
	uuid: string;
	createdTime: number;
	message: string;
	countOfBytes: number;
	countOfFiles: number;
	subType: string;
	countOfBytesUploaded: number;
	updatedTime: number;
	abortReason?: string;
	type: string;
	backupPlanDbId: number;
	finishedTime: number;
	activityLogPath: string;
	errorCount: number;
	backupSetUUID: string;
	// Note: this may still be `false` for an aborted activity when the post-backup script is running.
	aborted: boolean;
	dataVersion: number;
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
