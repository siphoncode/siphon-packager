#!/usr/bin/env python3
import subprocess

from siphon.packager.utils import cd, version_dir_path, get_versions
from siphon.packager.utils import version_production_env_path
from siphon.packager.utils import version_sandbox_env_path
from siphon.packager.constants import SERVER_DIR

def main():
    print('Installing packager dependencies...')
    with cd(SERVER_DIR):
        print('\n[Installing dependencies for packager server]')
        subprocess.call(['npm', 'install', '--loglevel', 'http'])

    versions = get_versions()
    for v in versions:
        # Check if a node_modules_dir exists in the version dir.
        # If it does, then this version has been installed
        print('\n[Installing dependencies for packager v%s]' % v)
        version_directory = version_dir_path(v)
        with cd(version_directory):
            subprocess.call(['npm', 'install', '--loglevel', 'http'])

        production_env_dir = version_production_env_path(v)
        with cd(production_env_dir):
            subprocess.call(['npm', 'install', '--loglevel', 'http'])

        sandbox_env_dir = version_sandbox_env_path(v)
        with cd(sandbox_env_dir):
            subprocess.call(['npm', 'install', '--loglevel', 'http'])

if __name__ == '__main__':
    main()
