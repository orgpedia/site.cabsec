name := site.cabsec/flow/genSite_

.DEFAULT_GOAL := genSite
.PHONY: genSite


genSite:
	uv run python src/minifyCSS.py conf/templates/orig conf/templates/miniCSS > logs/miniCSS.log;
	uv run python src/minifyHTML.py conf/templates/miniCSS conf/templates/miniHTML > logs/miniHTML.log;
	npx tailwindcss -c conf/tailwind.mini.config.js -i ./conf/templates/miniCSS/tailwindcss/input_new.css -o ./src/css/output.css --minify > logs/tailwind.log;
	uv run python src/genSite.py input output > logs/genSite.info.log;
