.PHONY: setup
setup:
	bun install --no-save

.PHONY: lint
lint: setup
	bun x @biomejs/biome check
	# TODO: type bundling (https://github.com/microsoft/TypeScript/issues/4433#issuecomment-1575099575)
	bun x readme-cli-help \
		--check-only \
		--fence ts \
		"./script/bundle-types.ts 1>&2 && cat ./.temp/types/index.d.ts"
	bun x tsc --noEmit --project .

.PHONY: format
format: setup
	bun x @biomejs/biome check --write
	# TODO: type bundling (https://github.com/microsoft/TypeScript/issues/4433#issuecomment-1575099575)
	bun x readme-cli-help \
		--fence ts \
		"./script/bundle-types.ts 1>&2 && cat ./.temp/types/index.d.ts"

.PHONY: publish
publish: setup
	# https://github.com/lgarron/repo
	repo publish

.PHONY: prepublishOnly
prepublishOnly: lint

.PHONY: clean
clean:
	rm -rf ./.temp

.PHONY: reset
reset:
	rm -rf ./.husky/_ ./node_modules
