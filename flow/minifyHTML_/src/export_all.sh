LANG="as bn brx doi gu hi kn ks gom mai mni ml mr ne or pa sa sat sd ta te ur en";
for l in `echo $LANG`; do
	cp -r output/$l ../../export;
	echo "done $l";
done;

for d in `echo i j c`; do
	cp -r output/$d ../../export;
done;

cp output/index.html ../../export;
cp output/disclaimer.html  ../../export; 

cp output/lunr.idx.json  ../../export; 
cp output/docs.json  ../../export; 
