import sys
from pathlib import Path

import docint
import orgpedia  # noqa

if __name__ == '__main__':
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    viz = docint.load('src/genSVG.yml')

    if input_path.is_dir():
        assert output_path.is_dir()
        input_files = list(input_path.glob('*.order.json'))

        docs = viz.pipe_all(input_files)
        for doc in docs:
            print(f'{doc.pdf_name}')

    else:
        doc = viz(input_path)
        doc.to_disk(output_path)
