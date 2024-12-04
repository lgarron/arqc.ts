# `arqc`

A wrapper for the [`arqc`](https://www.arqbackup.com/documentation/arq7/English.lproj/arqc.html) command.

## API

````ts
export declare function setArqcCommandPath(newPath: string): void;
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
export interface ArqBackupPlanConfig {
    backupPlanID: string;
    name?: string;
}
export declare class ArqBackupPlan {
    #private;
    config: ArqBackupPlanConfig;
    constructor(config: ArqBackupPlanConfig);
    latestBackupActivityJSON(): Promise<BackupActivityJSON>;
    latestBackupActivityLog(): Promise<string>;
    wasLatestBackupSuccessful(): Promise<boolean>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare function pauseBackups(minutes: number): Promise<void>;
export declare function resumeBackups(): Promise<void>;
````
