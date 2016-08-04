
import json
import os
import subprocess
import requests
import tempfile

from decimal import Decimal
from threading import Thread

from requests.exceptions import ConnectionError
from siphon.packager.constants import PACKAGER_URL
from siphon.packager.utils import cd, cleanup_dir, version_dir_path

class SiphonPackagerException(Exception):
    pass

def entry_files(project_path, version):
    """
    Returns a dictionary of entry files for the project of the format
    {
        "ios": "/path/to/entry.js",
        "android": "/path/to/entry.js"
    }
    """
    # Handle versions that are not cross-platform
    if Decimal(version) < Decimal('0.4'):
        return {'ios': os.path.join(project_path, 'index.ios.js')}

    result = {}
    # Check for a platform-agnostic entry:
    universal = os.path.join(project_path, 'index.js')

    if os.path.isfile(universal):
        result['ios'] = universal
        result['android'] = universal
        return result

    ios = os.path.join(project_path, 'index.ios.js')
    if os.path.isfile(ios):
        result['ios'] = ios

    android = os.path.join(project_path, 'index.android.js')
    if os.path.isfile(android):
        result['android'] = android

    return result

def build_header_bundle(version, minify, dev, sandbox, platform):
    """
    Takes a version of a base project, compiles a header bundle and writes it
    to stout.

    :param version: A string corresponding to the base version e.g. '0.1'
    """

    # Switch to the directory containing the correct version of our packager
    version_dir = version_dir_path(version)

    commands = [
        'node',
        'index',
        '--header',
        '--platform',
        platform
    ]

    if minify:
        commands.append('--minify')

    if dev:
        commands.append('--dev')

    if sandbox:
        commands.append('--sandbox')

    with cd(version_dir):
        header = subprocess.check_output(commands)
        print(header.decode('utf-8'))

def fetch_footer(version, entry, minify, platform, results, output_path):
    # This will be called as a worker for multithreaded footer requests
    payload = {
        'entryPath': entry,
        'version': version,
        'platform': platform,
        'outputPath': output_path
    }

    if minify:
        payload['minify'] = 'true'

    try:
        r = requests.get(PACKAGER_URL, params=payload)
        response = r.json()
        result = response.get('result').encode('utf-8', 'ignore').decode('utf-8')
        error = response.get('error').encode('utf-8', 'ignore').decode('utf-8')
    except ConnectionError:
        result = ''
        error = 'An internal error occurred. Please try again in a few minutes.'
    results.append({'result': result, 'error': error, 'platform': platform})

def build_footers(version, path, minify):
    """
    Takes the version of a base project, the path to a project directory
    and returns a json string of the format
    {
        "ios": "/Path/to/footer",
        "android": "/Path/to/footer",
    }

    The presence of a key is determined by the available footers.
    """
    entries = entry_files(path, version)
    threads = []
    results = []
    output_dir = tempfile.mkdtemp(prefix='siphon-packager-tmp-')

    for k in entries:
        platform = k
        file_name = 'bundle-footer-%s' % platform
        output_path = os.path.join(output_dir, file_name)

        t = Thread(target=fetch_footer, args=(version, entries[k], minify,
                   platform, results, output_path))
        t.start()
        threads.append(t)

    # Block until each thread has finished
    for t in threads:
        t.join()

    output_obj = {'ios': '', 'android': ''}

    error = None
    for r in results:
        platform = r['platform']
        # Set the error to the first one we encounter
        if r.get('error') and not error:
            error = r['error']
        else:
            output_obj[platform] = r['result']

    # If we have an error, clean up any footers that have been generated and
    # raise it.
    if error:
        for platform in output_obj:
            if output_obj[platform]:
                footer_dir = os.path.dirname(output_obj.get(platform))
                if 'siphon-packager-tmp-' in os.path.basename(footer_dir):
                    cleanup_dir(footer_dir)
        raise SiphonPackagerException(error)

    print(json.dumps(output_obj))
