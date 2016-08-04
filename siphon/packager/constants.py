import os

# Maps assets to their proper directory
ASSET_DIR_MAP = {
    'image': 'images'
}

# Maps an asset type to its proper extension
ASSET_EXTENSION_MAP = {
    'image': 'png'
}

PACKAGER_URL = 'http://127.0.0.1:8080'

SERVER_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                          '../../server')
VERSIONS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                            '../../server/versions')
SANDBOX_ENV_DIR_NAME = 'sandbox-env'

PRODUCTION_ENV_DIR_NAME = 'production-env'
