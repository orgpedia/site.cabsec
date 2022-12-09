import json
from pathlib import Path
import sys

import docint
import orgpedia




if __name__ == '__main__':
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    viz = docint.load('src/genSite.yml')    

    if input_path.is_dir():
        assert output_path.is_dir()
        input_files = list(input_path.glob('*.order.json'))
        
        docs = viz.pipe_all(input_files)
        for doc in docs:
            print(f'{doc.pdf_name}')
        
    else:
        doc = viz(input_path)
        ndoc.to_disk(output_path)
