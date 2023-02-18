name := site.cabsec/flow/subFlows/translate_

.DEFAULT_GOAL := translate
.PHONY: translate

translate:
	poetry run python src/generate_trans.py input output > logs/info.log;
