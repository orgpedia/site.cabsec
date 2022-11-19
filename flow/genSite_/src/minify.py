from html.parser import HTMLParser
from pathlib import Path
import sys
import string

IGNORE_STRS_IN_CLASS = ['primary', 'group', 'search', 'expand_text']

class_dict = {}
class ClassRecorder(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for k, v in ((k, v) for k, v in attrs if k == 'class'):
            v = v.strip()
            if not v or any(i in v for i in IGNORE_STRS_IN_CLASS):
                continue
            cnt = class_dict.get(v, 0)
            class_dict[v] = cnt+1


# Identify the classes to replace
class_recorder = ClassRecorder()
input_dir = Path(sys.argv[1])
for html_file in input_dir.glob('*.html'):
    class_recorder.feed(html_file.read_text())
class_recorder.close()

#class_cnt_list = sorted(class_dict.items(), key=lambda tup: len(tup[0])*tup[1], reverse=True)


cutoff = 1500
replace_classes = sorted((c for (c, cnt) in class_dict.items() if len(c) * cnt > cutoff), key=lambda c: -len(c))
new_names = [f'{c}-{d}' for c in string.ascii_letters[:26] for d in string.ascii_letters[:26]]
assert len(replace_classes) < len(new_names)

for html_file in input_dir.glob('*.html'):
    html_contents = html_file.read_text()
    output_lines = []
    for line in html_contents.split('\n'):
        if 'class=' in line:
            for (old, new) in zip(replace_classes, new_names):
                line = line.replace(old, new)
        output_lines.append(line)
        
    new_file = Path('new_output') / html_file.name
    new_file.write_text('\n'.join(output_lines))
#end

css_file = Path('output') / 'components.css'
css_components = '@layer components {\n'
for (old_cls, new_cls) in zip(replace_classes, new_names):
    #old_cls = old_cls.replace('[', '\[').replace(']', '\]').replace('.', '\.').replace('/', '\/').replace('#', '\#').replace(':', '\:')
    css_components += f'  .{new_cls} {{\n    @apply {old_cls};\n  }}\n'
css_components += '}'
css_file.write_text(css_components)


# print(len(class_cnt_list))
# print('\n'.join(f'{k}|{v}' for (k,v) in class_cnt_list))
# class_savings = sum(len(k) * v for (k,v) in class_dict.items())/(1000 * 1000)
        # if tag == 'path':
        #     for k, v in ((k, v) for k, v in attrs if k == 'd'):
        #         v = v.strip()
        #         cnt = path_dict.get(v, 0)
        #         path_dict[v] = cnt+1
        #     return
        
        # if tag == 'svg':
        #     global svg_count
        #     svg_count += 1
            
