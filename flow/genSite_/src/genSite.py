import os
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

    if not (output_path / 'cors-server.py').exists():
        src_path = Path('..') / Path('src') / 'cors-server.py'
        dst_path = output_path / 'cors-server.py'
        if not dst_path.exists():
            os.symlink(src_path, dst_path)

    for (src_dir, dst_dir) in [('js', 'j'), ('css', 'c'), ('images', 'i')]:
        src_path = Path('..') / Path('src') / src_dir
        dst_path = output_path / dst_dir
        if not dst_path.exists():
            os.symlink(src_path, dst_path)

    if input_path.is_dir():
        assert output_path.is_dir()
        input_files = input_path.glob('*.order.json')

        docs = viz.pipe_all(input_files)

        for doc in docs:
            print(f'{doc.pdf_name}')
