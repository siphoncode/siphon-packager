#!/usr/bin/env python3
import argparse
import sys

from siphon.packager.utils import get_latest_version, version_exists
from siphon.packager.utils import InvalidVersionTag
from siphon.packager.bundle import build_header_bundle
from siphon.packager.bundle import build_footers

def build(parser, args):
    # Collect the supplied arguments
    version = args.base_version
    minify = args.minify
    dev = args.dev
    platform = args.platform
    sandbox = args.sandbox

    # Check that a valid react native tag has been provided
    if not version_exists(version):
        raise InvalidVersionTag(version)

    if sandbox and not args.header:
        parser.print_usage()
        sys.exit(1)

    if args.header:
        # The dev flag only changes the header
        build_header_bundle(version, minify, dev, sandbox, platform)
    elif args.footer and args.project_path:
        build_footers(version, args.project_path, minify)
    else:
        parser.print_usage()
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('--base-version',
                        type=str,
                        default=get_latest_version(),
                        help='The base version you are building for')

    parser.add_argument('--dev',
                        action='store_true',
                        help='Compile in developer mode')

    parser.add_argument('--project-path',
                        type=str,
                        help='The path to the directory containing the '
                             'source files of the app (containing a '
                             'file named index.ios.js which will be '
                             'treated as the entry point into the app')

    parser.add_argument('--minify',
                        action='store_true',
                        help='Minify the resulting bundles')

    parser.add_argument('--platform',
                        type=str,
                        default='ios',
                        help='The platform the footer will be built for.')

    parser.add_argument('--sandbox',
                        action='store_true',
                        help='The header will be appropriate for the sandbox')

    # --header and --footer are mutually exclusive
    header_footer = parser.add_mutually_exclusive_group()
    header_footer.add_argument('--footer',
                               action='store_true',
                               help='Generate the footer file for a '
                               'given app at the supplied '
                               'project path')

    header_footer.add_argument('--header',
                               action='store_true',
                               help='Generate a header file')

    args = parser.parse_args()
    try:
        build(parser, args)
    except Exception as e:
        sys.stderr.write('[Packager] %s\n' % e)
        sys.exit(1)

if __name__ == '__main__':
    main()
