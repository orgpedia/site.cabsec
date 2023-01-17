.PHONY: genSVG

name := site.cabsec/flow/genSVG_
poetry := $(shell command -v poetry 2> /dev/null)

.DEFAULT_GOAL := genSVG


genSVG:
	$(poetry) run python src/genSVG.py input output > logs/genSVG.txt;
