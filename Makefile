.PHONY: setup
setup:
	bun install --no-save


.PHONY: lint
lint:
	# TODO: type bundling (https://github.com/microsoft/TypeScript/issues/4433#issuecomment-1575099575)
	bun x readme-cli-help \
		--check-only \
		--fence ts \
		"npx tsc --project . && cat ./.temp/types/index.d.ts"

.PHONY: format
format:
	# TODO: type bundling (https://github.com/microsoft/TypeScript/issues/4433#issuecomment-1575099575)
	bun x readme-cli-help \
		--fence ts \
		"npx tsc --project . && cat ./.temp/types/index.d.ts"

.PHONY: publish
publish:
	# https://github.com/lgarron/repo
	repo publish

.PHONY: prepublishOnly
prepublishOnly: lint

.PHONY: clean
clean:
	rm -rf ./.temp

.PHONY: reset
reset:
	rm -rf ./node_modules
