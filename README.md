# `arqc`

A wrapper for the [`arqc`](https://www.arqbackup.com/documentation/arq7/English.lproj/arqc.html) command.

## API

````ts
interface BackupActivityJSON {
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
interface ArqBackupPlanConfig {
    backupSetUUID: string;
    name?: string;
    storageLocation?: string;
}
declare class ArqBackupPlan {
    #private;
    config: ArqBackupPlanConfig;
    constructor(config: ArqBackupPlanConfig);
    latestBackupActivityJSON(): Promise<BackupActivityJSON>;
    latestBackupActivityLog(): Promise<string>;
    wasLatestBackupSuccessful(): Promise<boolean>;
    start(): Promise<void>;
    stop(): Promise<void>;
}

declare function acceptLicenseAgreement(): Promise<void>;
declare function pauseBackups(minutes: number): Promise<void>;
declare function resumeBackups(): Promise<void>;
declare function listBackupPlans(): Promise<ArqBackupPlan[]>;

declare function setArqcCommandPath(newPath: string): void;

export { ArqBackupPlan, type ArqBackupPlanConfig, type BackupActivityJSON, acceptLicenseAgreement, listBackupPlans, pauseBackups, resumeBackups, setArqcCommandPath };
````
