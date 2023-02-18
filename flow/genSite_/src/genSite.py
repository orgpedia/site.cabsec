import sys
from pathlib import Path

import docint
import orgpedia  # noqa

if __name__ == '__main__':
    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    if not output_path.exists():
        output_path.mkdir()

    viz = docint.load('src/genSite.yml')

    if input_path.is_dir():
        assert output_path.is_dir()
        input_files = list(input_path.glob('*.order.json'))

        docs = viz.pipe_all(input_files)
        for doc in docs:
            print(f'{doc.pdf_name}')
