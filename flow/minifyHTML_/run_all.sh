for f in `ls input/*.html |xargs  basename`; do 
	sh src/html_minify input/$f > output/$f; 
done
