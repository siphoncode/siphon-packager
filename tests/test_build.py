
import os
import shlex
import unittest
import subprocess
import difflib
import sys


def get_version():
    """
    The current version being tested is stored by run-tests.py in an
    environment variable.
    """
    return os.environ['SP_PACKAGER_TEST_VERSION']

def get_resource(name):
    fil = 'tests/resources/v%s/%s' % (get_version(), name)
    return open(fil).read()

def run_packager_cmd(cmd, get_output=False):
    # Pass in options as if you were running ./siphon-packager in the cmd line
    c = 'python siphon-packager.py --react-native-tag %s %s' % (
        get_version(), cmd)
    commands = shlex.split(c)
    if get_output:
        return subprocess.check_output(commands)
    else:
        subprocess.run(commands)

def print_diffs(a, b):
    a = a.split('\n')
    b = b.split('\n')
    for line in difflib.context_diff(a, b):
        print(line)


class TestBundleBuilds(unittest.TestCase):
    def test_header_build(self):
        print('Building header...')
        output = run_packager_cmd('--header', True).decode('utf8')
        print('Done.')
        truth = get_resource('header')
        if output != truth:
            print('[DIFFS: header]')
            print_diffs(truth, output)
            self.assertEqual(truth, output)

    def test_header_build_minified(self):
        print('Building minified header...')
        output = run_packager_cmd('--header --minify', True).decode('utf8')
        print('Done.')
        truth = get_resource('header_min')
        if output != truth:
            print('[DIFFS: header_min]')
            print_diffs(truth, output)
            self.assertEqual(truth, output)

    def test_header_build_dev(self):
        print('Building development-mode header...')
        output = run_packager_cmd('--header --dev', True).decode('utf8')
        print('Done.')
        truth = get_resource('header_dev')
        if output != truth:
            print('[DIFFS: header_dev]')
            print_diffs(truth, output)
            self.assertEqual(truth, output)
