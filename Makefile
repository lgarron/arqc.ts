.PHONY: check
check: lint check-package.json

.PHONY: setup
setup:
	bun install --no-save

.PHONY: lint
lint: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check
	# TODO: type bundling (https://github.com/microsoft/TypeScript/issues/4433#issuecomment-1575099575)
	bun x -- bun-dx --package readme-cli-help readme-cli-help -- check
	bun x tsc --noEmit --project .

.PHONY: format
format: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check --write
	# TODO: type bundling (https://github.com/microsoft/TypeScript/issues/4433#issuecomment-1575099575)
	bun x -- bun-dx --package readme-cli-help readme-cli-help -- update

.PHONY: check-package.json
check-package.json:
	bun x -- bun-dx --package @cubing/dev-config package.json -- check

.PHONY: publish
publish: setup
	npm publish

.PHONY: prepublishOnly
prepublishOnly: clean check

.PHONY: clean
clean:
	rm -rf ./.temp

.PHONY: reset
reset:
	rm -rf ./node_modules
