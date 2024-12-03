.PHONY: setup
setup:
	bun install --no-save


.PHONY: lint
lint:
	bun x readme-cli-help \
		--check-only \
		--fence ts \
		"npx tsc --project . && cat ./.temp/types/index.d.ts"

.PHONY: format
format:
	bun x readme-cli-help \
		--fence ts \
		"npx tsc --project . && cat ./.temp/types/index.d.ts"

.PHONY: prepublishOnly
prepublishOnly:
	lint
