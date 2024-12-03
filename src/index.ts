import { $, type ShellPromise } from "bun";

let arqcCommandPath = "/Applications/Arq.app/Contents/Resources/arqc";
export function setArqcCommandPath(newPath: string) {
	arqcCommandPath = newPath;
}

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
	abortReason: string;
	type: string;
	backupPlanDbId: number;
	finishedTime: number;
	activityLogPath: string;
	errorCount: number;
	backupSetUUID: string;
	aborted: boolean;
	dataVersion: number;
}

export class ArqBackupPlan {
	constructor(
		public config: {
			backupPlanID: string;
			name?: string;
		},
	) {}

	#runSimpleCommand(commandName: string): ShellPromise {
		return $`${arqcCommandPath} ${commandName} ${this.config.backupPlanID}`;
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

// This is unimplemented due to a security/correctness issue.
// export function listBackupPlans(): ArqBackupPlan[] {}

// Note: `arqc` accepts a negative number and/or fractional amount of minutes, so we allow this as well.
export async function pauseBackups(minutes: number): Promise<void> {
	await $`${arqcCommandPath} pauseBackups ${minutes}`;
}

// Note: `arqc` accepts a negative number and/or fractional amount of minutes, so we allow this as well.
export async function resumeBackups(minutes: number): Promise<void> {
	await $`${arqcCommandPath} resumeBackups}`;
}
