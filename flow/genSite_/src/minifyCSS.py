import string
import sys
from html.parser import HTMLParser
from os.path import relpath
from pathlib import Path

INPUT_HDR = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n'
PY_CLASSES = ['text-base font-semibold leading-5', 'text-sm font-normal leading-4']


class ClassRecorder(HTMLParser):
    def __init__(self):
        super().__init__()
        self.class_dict = {}
        self.file_name = None
        self.file_line_num = 0

    def read_lines(self, html_file):
        self.file_name = html_file.name
        self.file_line_num = self.getpos()[0]
        self.file_lines = Path(html_file).read_text().split('\n')

    def get_line(self):
        line_num = self.getpos()[0] - self.file_line_num
        return self.file_lines[line_num]

    def handle_starttag(self, tag, attrs):
        for k, v in ((k, v) for k, v in attrs if k == "class"):
            assert '\n' not in v, f'new line found in class {v} {self.file_napme}'
            assert '  ' not in v, f'double space found in class {v} {self.file_name}'
            v = v.strip()
            line = self.get_line()

            if '<!-- ignore -->' in line:
                continue

            ignore_idx = None
            if '<!-- ignore' in line:
                idx_pos = line.index('<!-- ignore ') + len('<!-- ignore ')
                ignore_idx, _ = line[idx_pos:].split(maxsplit=1)
                ignore_idx = int(ignore_idx)

            class_list = v.strip().split()
            class_list = class_list[:ignore_idx]
            long_class = ' '.join(class_list)
            if not long_class.strip():
                assert False

            if long_class != 'primary':
                self.class_dict.setdefault(long_class, []).append(self.file_name)


def get_classes(input_dir):
    print(f'Reading {input_dir}')
    class_recorder = ClassRecorder()

    for html_file in input_dir.rglob("*.html"):
        if '.bak' in str(html_file):
            continue
        class_recorder.read_lines(html_file)
        class_recorder.feed(html_file.read_text())
    class_recorder.close()

    keys = class_recorder.class_dict.keys()
    return sorted(keys, key=lambda k: -len(k))


def write_components(css_path, class_pairs):
    css_components = INPUT_HDR + "@layer components {\n"
    for (long_cls, short_cls) in class_pairs:
        if '{{' in long_cls:
            continue
        css_components += f"  .{short_cls} {{\n    @apply {long_cls};\n  }}\n"
    css_components += "}"
    css_path.write_text(css_components)


def write_html(input_dir, output_dir, class_pairs):
    print(f"Writing from {input_dir} -> {output_dir}")

    for html_file in input_dir.rglob("*.html"):
        if '.bak' in str(html_file):
            continue

        html_contents = html_file.read_text()
        output_lines = []
        for line in html_contents.split("\n"):
            if "class=" in line and ("<!-- ignore -->" not in line):
                for (long, short) in class_pairs:

                    if f'class="{long}' in line:
                        print(f'Replacing {str(html_file)} |{line.lstrip()}| {long} -> {short}')
                        line = line.replace(f'class="{long}', f'class="{short}')
                        break
            output_lines.append(line)

        rel_path = relpath(str(html_file), str(input_dir))
        new_file = output_dir / Path(rel_path)

        print(new_file)
        new_file.parent.mkdir(exist_ok=True)
        new_file.write_text("\n".join(output_lines))


if __name__ == "__main__":
    input_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(exist_ok=True)

    long_classes = PY_CLASSES + get_classes(input_dir)

    print(long_classes)

    ltrs = string.ascii_letters
    short_classes = [f"{c}-{d}" for c in ltrs[:26] for d in ltrs[:26]]

    class_pairs = list(zip(long_classes, short_classes))
    components_dir = output_dir / Path("tailwindcss")
    components_dir.mkdir(exist_ok=True)
    components_path = components_dir / "input_new.css"
    write_components(components_path, class_pairs)

    write_html(input_dir, output_dir, class_pairs)
