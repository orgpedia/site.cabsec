import json
import sys
from pathlib import Path

import yaml

# ISO 639 language codes
# Bodo/Boro: brx,
LANG_CODES = [
    'as',
    'bn',
    'brx',
    'doi',
    'gu',
    'hi',
    'kn',
    'ks',
    'gom',
    'mai',
    'mni',
    'ml',
    'mr',
    'ne',
    'or',
    'pa',
    'sa',
    'sat',
    'sd',
    'ta',
    'te',
    'ur',
]

LANG_SCRIPT_DICT = {
    'as': 'as',
    'bn': 'bn',
    'brx': 'hi',
    'doi': 'hi',
    'gu': 'gu',
    'hi': 'hi',
    'kn': 'kn',
    'ks': 'ur',
    'gom': 'hi',
    'mai': 'hi',
    'mni': 'mni',
    'ml': 'ml',
    'mr': 'hi',
    'ne': 'hi',
    'or': 'or',
    'pa': 'pa',
    'sa': 'hi',
    'sat': 'sat',
    'sd': 'hi',
    'ta': 'ta',
    'te': 'te',
    'ur': 'ur',
    'en': 'en',
}

TRANSLATIONS_DIR = Path('hand')
STUBS = ['digits', 'labels', 'ministry']


def load_translations(trans_dir, stub):
    en_path = Path(trans_dir) / f'{stub}.master.txt'
    en_texts = en_path.read_text().strip().split('\n')

    en_texts_dict = dict((n.strip(), {}) for n in en_texts)
    for (lang, script_lang) in LANG_SCRIPT_DICT.items():
        lang_text_path = Path(trans_dir) / f'{stub}.{lang}.txt'
        if not lang_text_path.exists():
            if stub in ('names', 'digits', 'initials'):
                lang_text_path = Path(trans_dir) / f'{stub}.{script_lang}.txt'
            else:
                print(f'Unable to find file {str(lang_text_path)}')
                continue
        lang_texts = lang_text_path.read_text().rstrip().split('\n')

        assert len(lang_texts) == len(
            en_texts
        ), f'Mismatch {stub} {lang}:{len(lang_texts)} en:{len(en_texts)}'
        for idx, text in enumerate(lang_texts):
            en_texts_dict[en_texts[idx]][lang] = text.strip()

    return en_texts_dict


if __name__ == '__main__':
    input_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])

    trans_dict = {}
    for stub in STUBS:
        trans_dict[stub] = load_translations(TRANSLATIONS_DIR, stub)
    # end for

    officer_infos = json.loads((input_dir / 'officer_infos.json').read_text())
    post_infos = json.loads((input_dir / 'post_infos.json').read_text())

    trans_dict['names'] = {}
    for officer_info in officer_infos:
        lang_names = officer_info['language_names']
        en_name = lang_names['en']
        trans_dict['names'][en_name] = lang_names

    trans_dict['dept'] = post_infos['translations_dept']
    trans_dict['role'] = post_infos['translations_role']

    output_path = output_dir / 'trans.yml'
    output_path.write_text(
        yaml.dump(
            {
                'names': trans_dict['names'],
                'dept': trans_dict['dept'],
                'role': trans_dict['role'],
                'digits': trans_dict['digits'],
                'labels': trans_dict['labels'],
                'ministry': trans_dict['ministry'],
            }
        )
    )
