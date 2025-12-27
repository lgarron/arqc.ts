#!/usr/bin/env bun

import { Path } from "path-class";
import { PrintableShellCommand } from "printable-shell-command";

await using TEMP_DIR = await Path.makeTempDir();
await new PrintableShellCommand("bun", [
	"x",
	"--",
	"bun-dx",
	["--package", "tsup"],
	"tsup",
	"--",
	"./src/index.ts",
	"--dts-only",
	["--format", "esm"],
	["--out-dir", TEMP_DIR],
]).spawn({ stdio: ["ignore", "ignore", "inherit"] }).success;

console.log(await TEMP_DIR.join("index.d.ts").readText());
