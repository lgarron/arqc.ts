#!/usr/bin/env bun

import { $ } from "bun";

await $`bun x tsup \
  ./src/index.ts \
  --dts-only \
  --format esm \
  --out-dir ./.temp/types/
`;
