#!/usr/bin/env python3

import os
import subprocess

from siphon_dependencies import Dependencies

from termcolor import colored

from siphon.packager.utils import cd, get_latest_version, version_dir_path, yn
from siphon.packager.utils import cd

def npm_install(dir):
    # Runs 'npm install' in a given directory
    with cd(dir):
        subprocess.call(['npm', 'install'])

def update_packages(dependencies):
    # Updates package.json files accordingly (production-env & sandbox-env).
    # If install is True, then install the latest packages also.
    # dependencies is a Dependencies object.

    for e in ['production', 'sandbox']:
        print(colored('Updating %s package.json file...' % e, 'yellow'))
        env_dir = '%s-env' % e
        env_path = os.path.join(version_dir_path(dependencies.version), env_dir)
        pkg_path = os.path.join(env_path, 'package.json')
        dependencies.update_package_file(pkg_path, e)

        update_modules = yn(colored('Would you like to update your local ' \
                                    'node_modules? [Y/n] ', 'yellow'))
        if update_modules:
            npm_install(env_path)

def master_footer(platform):
    # Returns the bottom part of our master files for a given platform
    if platform == 'android':
        return "var SPLog = require('NativeModules').SPLog;\n" \
               'var __nativeLoggingHook = global.nativeLoggingHook;\n' \
               'global.nativeLoggingHook = function(s, logLevel) {\n' \
               '  __nativeLoggingHook(s, logLevel);\n' \
               '  SPLog.log(s);\n' \
               '};\n' \
               '\nmodule.exports = {};'
    else:
        return 'module.exports = {};'

def update_master_files(dependencies):
    # Updates master.<platform>.js files accordingly
    for e in ['production', 'sandbox']:
        env_dir = '%s-env' % e
        env_path = os.path.join(version_dir_path(dependencies.version), env_dir)
        for p in ['android', 'ios']:
            print('Updating %s master.%s.js...' % (e, p))
            master_path = os.path.join(env_path, 'master.%s.js' % p)
            updated = '\n'

            for d in dependencies.dependency_list():
                platform_entry = dependencies.dependency_data[d]['entry'].get(p)
                if platform_entry:
                    updated += "require('%s');\n" % d
                    # Check if there are any "additional_requires" that we
                    # can include.
                    additional = dependencies.dependency_data[d] \
                    .get('additional_requires')

                    if additional:
                        for r in additional:
                            updated += "require('%s');\n" % r

            updated += '\n'
            updated += master_footer(p)
            updated += '\n'

            with open(master_path, 'w') as f:
                f.write(updated)
            print('Done')

def find_entry_file(package):
    # TODO
    # Returns the entry file of a node module relative to the package root
    pass

def update_constants(version):
    # TODO
    # Updates the packager constants file
    pass

def main():
    '''
    Automates all the update work required when adding a new version dependency.
    This reads a given dependency file (corresponding to a given base version)
    from our siphon-dependenencies repo, and updates for a given version the
    package.json file in package-resources.

    Options:
    * --all: Synchronize all versions. Default: Latest version
    * --base-verson <base_version>: Synchronize ony the provided version.
      Default: Latest version

    The packager should then be ready to be committed to the appropriate branch,
    and used locally to generate the latest headers/footers.
    '''

    version = get_latest_version()
    print(colored('Fetching latest dependencies...', 'yellow'))
    dependencies = Dependencies(version)
    print(dependencies.dependency_data)
    print('Done')
    update_packages(dependencies)
    update_master_files(dependencies)
    print(colored('WARNING: Please make sure ' \
          'server/versions/%s/siphon/packager/constants.js ' \
          'is up to date.' % version, 'red'))

if __name__ == '__main__':
    main()
