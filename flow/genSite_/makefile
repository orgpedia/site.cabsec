.PHONY: genSite

name := site.cabsec/flow/genSite_

poetry := $(shell command -v poetry 2> /dev/null)
npx := $(shell command -v npx 2> /dev/null)

.DEFAULT_GOAL := genSite


genSite:
	$(poetry) run python src/minifyCSS.py conf/templates/orig conf/templates/miniCSS > logs/miniCSS.txt;
	sh src/minify_html_dir conf/templates/miniCSS conf/templates/miniHTML > logs/miniHTML.txt;
	$(npx) tailwindcss -c conf/tailwind.mini.config.js -i ./conf/templates/miniCSS/tailwindcss/input_new.css -o ./src/css/output.css --minify > logs/tailwind.txt;
	poetry run python src/genSite.py input output > logs/genSite.log.txt;
