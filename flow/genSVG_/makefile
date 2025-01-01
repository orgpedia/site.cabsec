name := site.cabsec/flow/genSVG_

.DEFAULT_GOAL := genSVG
.PHONY: genSVG

genSVG:
	poetry run python src/genSVG.py input output > logs/info.log;


### Following steps need to be done to create the image, you only need to create
## p-0XX.jpg image in that directory
# cd 1_Upload_3795 
# ln -s ../../../../../cabsec/export/page_images/1_Upload_3795 cabsec
# for f in `ls cabsec/*.png`; do num=`echo $f|cut -d'-' -f2`; convert -strip -interlace plane -gaussian-blur 0.05 -quality 60% -resize 1024 $f p-$num.jpg; done
# for f in `ls or*.svg | rmext`; do  convert -strip -interlace plane -gaussian-blur 0.05 -quality 60% -resize 1024 $f.svg $f.jpg; done
# for f in `ls or*.jpg p*.jpg d*.svg`; do echo $f; cld uploader upload $f folder="moi/1_Upload_3XX5" use_filename=true unique_filename=false headers="X-Robots-Tag: noindex"; done
