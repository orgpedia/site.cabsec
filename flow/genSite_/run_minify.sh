python src/minifyCSS.py conf/templates conf/miniCSSTemplates > /dev/null;
sh src/minify_html_dir conf/miniCSSTemplates conf/miniHTMLTemplates;
python src/genSite.py input output > logs/info.log.txt;
npx tailwindcss -c tailwind.mini.config.js -i ./conf/miniCSSTemplates/tailwindcss/input_new.css -o ./output/css/output.css --minify;
