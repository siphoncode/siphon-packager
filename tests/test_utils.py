
import unittest
import os
import siphon.packager.utils as utils

from tempfile import TemporaryDirectory


class TestVersionUtils(unittest.TestCase):
    def test_get_latest_version(self):
        # Make a temporary directory, populate it with some versions and return
        # the latest.
        dummy_versions = [
            'v0.2.3',
            'v0.1.12',
            'v4.4.3',
            'v3.14.30',
            'v5.0.0',
            'v1.11.12',
            'v4.4.4'
        ]
        # Make a temporary directory with dummy version directories
        with TemporaryDirectory() as td:
            path = os.getcwd()
            for v in dummy_versions:
                 os.mkdir(td + '/' + v)
            latest_v = utils.get_latest_version(td)
        self.assertEqual(latest_v, '5.0.0')
