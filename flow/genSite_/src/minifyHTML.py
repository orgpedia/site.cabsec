import subprocess
import sys
from pathlib import Path

MinifierOptions = ['--remove-comments', '--remove-attribute-quotes', \
                   '--collapse-whitespace', '--use-short-doctype', '--remove-optional-tags',\
                   '--collapse-inline-tag-whitespace']

if __name__ == "__main__":
    input_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(exist_ok=True)

    for html_file in input_dir.glob('*.html'):
        output_file = output_dir / html_file.name
        cmd = ['npx', 'html-minifier'] + MinifierOptions + ['-o', str(output_file), str(html_file)]
        subprocess.check_call(cmd)
        print(cmd)

    input_include_dir = input_dir / 'include'
    output_include_dir = output_dir / 'include'
    output_include_dir.mkdir(exist_ok=True)
    
    for html_file in input_include_dir.glob('*.html'):
        output_include_file = output_include_dir / html_file.name
        cmd = ['npx', 'html-minifier'] + MinifierOptions + ['-o', str(output_include_file), str(html_file)]
        subprocess.check_call(cmd)        
        print(cmd)
        

