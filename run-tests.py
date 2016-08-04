#!/usr/bin/env python3
import os
import unittest
import argparse

from siphon.packager.utils import get_latest_version, version_exists
from siphon.packager.utils import InvalidVersionTag


def main(version):
    # Check that a valid react native tag has been provided
    os.environ['SP_PACKAGER_TEST_VERSION'] = version
    if not version_exists(version):
        raise InvalidVersionTag(version)

    # Run the tests
    print('Running tests...')
    suite = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=1).run(suite)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--react-native-tag',
                        type=str,
                        default=get_latest_version(),
                        help='The version of our packager you wish to test. '
                             'e.g. 0.11.4')
    args = parser.parse_args()
    main(args.react_native_tag)
