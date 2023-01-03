python src/minify.py conf/templates/ conf/templates/minifyCSS

for f in `ls conf/templates/minifyCSS/*.html |xargs  basename `; do 
	sh src/html_minify conf/templates/minifyCSS/$f conf/templates/minifyHTML/$f; 
	#echo "$l/$f";
done;

for f in `ls conf/templates/minifyCSS/include/*.html |xargs  basename `; do 
	sh src/html_minify conf/templates/minifyCSS/include/$f conf/templates/minifyHTML/include/$f; 
	#echo "$l/$f";
done;

#export TEMPLATE_STUB='minifyCSS';
export TEMPLATE_STUB='minifyHTML';

#python src/genSite.py input output > logs/info.minify.txt;
npx tailwindcss -i conf/templates/minifyCSS/tailwindcss/input_new.css -o output/css/output.css;
export -n TEMPLATE_STUB;
