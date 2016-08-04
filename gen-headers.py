#!/usr/bin/env python3

import copy
import json
import os
import sys
from siphon.packager.utils import ensure_dir_exists, out_to_file

CONF = os.path.join(os.path.dirname(__file__), 'gen-conf.json')

def print_usage():
    print('Required arguments:' \
          '\n* --dest /path/to/dest' \
          '\n* --platform <ios/android>' \
          '\n* --base-version <base-version>' \
          '\n\nOptional arguments:' \
          '\n* --conf <conf_name>')

def main():
    conf = {}
    if '--conf' in sys.argv:
        try:
            conf_name = sys.argv[sys.argv.index('--conf') + 1]
        except (ValueError, IndexError):
            print_usage()
            sys.exit(1)

        with open(CONF, 'r') as f:
            conf_file = json.loads(f.read())

        conf = conf_file['headers'].get(conf_name)
        if not conf:
            print('Specified config not found in conf.json')
            sys.exit(1)

    # Takes a destination and platform as arguments. The headers for the
    # appropriate platform are written to this directory
    base_version = None
    try:
        if conf.get('base_version'):
            dest = conf.get('base_version')
        elif '--base-version' in sys.argv:
            base_version = sys.argv[sys.argv.index('--base-version') + 1]

        if conf.get('dest'):
            dest = conf.get('dest')
        else:
            dest = sys.argv[sys.argv.index('--dest') + 1]

        if conf.get('platform'):
            platform = conf.get('platform')
        else:
            platform = sys.argv[sys.argv.index('--platform') + 1]
    except (ValueError, IndexError):
        print_usage()
        sys.exit(1)

    ensure_dir_exists(dest)

    base_cmd = [
        'python',
        'siphon-packager.py',
        '--header',
        '--platform',
        platform
    ]

    if base_version is not None:
        base_cmd += ['--base-version', base_version]

    additional_flags = {
        'header': [],
        'header-dev': ['--dev'],
        'sandbox-header': ['--sandbox'],
        'sandbox-header-dev': ['--sandbox', '--dev'],
    }

    ordered = ['header', 'header-dev', 'sandbox-header', 'sandbox-header-dev']

    for n in ordered:
        print('Building %s...' % n)
        cmd = copy.copy(base_cmd) + additional_flags[n]
        out_path = os.path.join(dest, n)
        print('[%s]' % ' '.join(cmd))
        out_to_file(cmd, out_path)
        print('Done')

if __name__ == '__main__':
    main()
