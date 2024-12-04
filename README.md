# `arqc`

A wrapper for the [`arqc`](https://www.arqbackup.com/documentation/arq7/English.lproj/arqc.html) command.

## API

See implementation files for details.

````ts
export { type BackupActivityJSON, type ArqBackupPlanConfig, ArqBackupPlan, } from "./ArqBackupPlan";
export { acceptLicenseAgreement, pauseBackups, resumeBackups, listBackupPlans, } from "./globalCommands";
export { setArqcCommandPath } from "./arqcCommand";
````
