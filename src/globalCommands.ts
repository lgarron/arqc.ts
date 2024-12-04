import { $ } from "bun";
import { ArqBackupPlan } from "./ArqBackupPlan";
import { arqcCommand } from "./arqcCommand";

// This is unimplemented due to a security/correctness issue.
// export function listBackupPlans(): ArqBackupPlan[] {}

export async function acceptLicenseAgreement(): Promise<void> {
	await $`${arqcCommand.path} acceptLicenseAgreement`;
}

// Note: `arqc` accepts a negative number and/or fractional amount of minutes, so we allow this as well.
export async function pauseBackups(minutes: number): Promise<void> {
	await $`${arqcCommand.path} pauseBackups ${minutes}`;
}

export async function resumeBackups(): Promise<void> {
	await $`${arqcCommand.path} resumeBackups}`;
}

const regex =
	/^UUID=(?<backupSetUUID>[A-F0-9\-]+)\tname="(?<name>[^"]+)"\tstorage location="(?<storageLocation>[^"]+)"/;

function countDoubleQuotes(s: string): number {
	let count = 0;
	for (const char of s) {
		if (char === '"') {
			count++;
		}
	}
	return count;
}

export async function listBackupPlans(): Promise<ArqBackupPlan[]> {
	const lines = (await $`${arqcCommand.path} listBackupPlans`.text())
		.trim()
		.split("\n");
	const lastLine = lines.splice(lines.length - 1)[0];
	if (!lastLine.startsWith("total backup plans:")) {
		throw new Error("Unexpected format for `listBackupPlans` output.");
	}
	const plans: ArqBackupPlan[] = [];
	for (const line of lines) {
		if (countDoubleQuotes(line) !== 4) {
			throw new Error(
				"Unexpected format for `listBackupPlans` output: name or storage location includes double quote characters. This is unsupported for security reasons.",
			);
		}
		const match = regex.exec(line);
		if (!match) {
			throw new Error("Unexpected format for `listBackupPlans` output.");
		}
		const { backupSetUUID, name, storageLocation } = (
			match as unknown as {
				groups: {
					backupSetUUID: string;
					name: string;
					storageLocation: string;
				};
			}
		).groups;
		plans.push(
			new ArqBackupPlan({
				backupSetUUID: backupSetUUID,
				name,
				storageLocation,
			}),
		);
	}
	return plans;
}

export async function listBackupPlansByID(): Promise<
	Record<string, ArqBackupPlan>
> {
	const plans: Record<string, ArqBackupPlan> = {};
	for (const plan of await listBackupPlans()) {
		plans[plan.config.backupSetUUID] = plan;
	}
	return plans;
}
