
import errno
import os
import shutil
import subprocess
import tempfile

from contextlib import contextmanager
from pkg_resources import parse_version

from siphon.packager.constants import VERSIONS_DIR
from siphon.packager.constants import SANDBOX_ENV_DIR_NAME
from siphon.packager.constants import PRODUCTION_ENV_DIR_NAME

class InvalidVersionTag(Exception):
    """ Exception corresponding to an invalid version tag being provided """
    def __init__(self, tag):
        self.tag = tag

    def __str__(self):
        return 'Invalid value for "base_version" key: %s' % self.tag


def version_dir_path(version):
    """ Takes a base version and returns the absolute directory path """
    return os.path.join(VERSIONS_DIR, version)

def version_production_env_path(version):
    """ Takes a base version and returns the path to the production env dir """
    return os.path.join(version_dir_path(version), PRODUCTION_ENV_DIR_NAME)

def version_sandbox_env_path(version):
    """ Takes a base version and returns the path to the production env dir """
    return os.path.join(version_dir_path(version), SANDBOX_ENV_DIR_NAME)

def get_versions(directory=VERSIONS_DIR):
    """ Returns a list of versions that we support """
    with cd(directory):
        cwd = os.getcwd()
        # Compile a list of available versions
        available_versions = [f for f in os.listdir(cwd)]
        available_versions.sort(key=lambda f: parse_version(f), reverse=True)

    return available_versions

def get_latest_version(directory=VERSIONS_DIR):
    """ Returns the latest base version that we support """
    available_versions = get_versions(directory)
    return available_versions[0]

def version_exists(version):
    """ Takes a base version and checks if it is supported """
    version_dir = version_dir_path(version)
    return os.path.isdir(version_dir)

def yn(msg):
    try:
        valid_response = False
        while not valid_response:
            response = input(msg) or 'y'
            if response == 'y' or response == 'Y':
                return True
            elif response == 'n' or response == 'N':
                return False
            else:
                msg = 'Please enter \'y\' or \'n\': '
    except KeyboardInterrupt:
        return False

# A manager for managing the directory we're running processes in
# Credit: http://stackoverflow.com/questions/431684/how-do-i-cd-in-python/
# 24176022#24176022
@contextmanager  # Lets you use 'with'
def cd(new_dir):
    prev_dir = os.getcwd()
    os.chdir(os.path.expanduser(new_dir))
    try:
        yield  # A contextmanager must yield
    finally:
        os.chdir(prev_dir)

def cleanup_dir(dir):
    if os.path.isdir(dir):
        shutil.rmtree(dir, ignore_errors=True)

def out_to_file(cmd, dest):
    # Takes a shell command and writes the output to given file
    with open(dest, 'w') as f:
        subprocess.call(cmd, stdout=f)

def ensure_dir_exists(path):
    """ Ensure that a directory at the given path exists """
    try:
        os.makedirs(path)
    except OSError as e:
        if e.errno != errno.EEXIST:
            raise

@contextmanager
def make_temp_dir(suffix=''):
    """ Use this within a `with` statement. Cleans up after itself. """
    path = tempfile.mkdtemp(suffix=suffix)
    try:
        yield path
    finally:
        shutil.rmtree(path)


def write_directory_zip(directory, zf):
    for root, dirs, files in os.walk(directory):
        for f in files:
            zf.write(os.path.join(root, f))
