LANG="as bn brx doi gu hi kn ks gom mai mni ml mr ne or pa sa sat sd ta te ur en";
for l in `echo $LANG`; do
echo "starting $l";
for f in `ls input/$l/*.html |xargs  basename `; do 
	sh src/html_minify input/$l/$f > output/$l/$f; 
	#echo "$l/$f";
done;
echo "done $l";
done;

sh src/html_minify input/index.html > output/index.html;
sh src/html_minify input/disclaimer.html > output/disclaimer.html;
