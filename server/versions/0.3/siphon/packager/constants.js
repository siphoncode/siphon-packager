
module.exports = {

  BASE_VERSION: '0.3',

  SERVER: {
    HOSTNAME: '127.0.0.1',
    PORT: 8080,
  },

  MODULE_TYPES: {
    HEADER_NODE_MODULE: 'HEADER_NODE_MODULE',
    PROJECT_NODE_MODULE: 'PROJECT_NODE_MODULE',
    PROJECT_MODULE: 'PROJECT_MODULE',
    PROJECT_ASSET: 'PROJECT_ASSET',
  },

  HEADER_MODULES: {
    'react-native': 'react-native/Libraries/react-native/react-native.js',
    'dismissKeyboard': 'dismissKeyboard',
    'Dimensions': 'Dimensions',
    'EventEmitter': 'EventEmitter',
    'AssetRegistry': 'AssetRegistry',
    'NativeModules': 'NativeModules',
    'underscore': 'underscore/underscore.js',
    'superagent': 'superagent/lib/client.js',
    'react-native-vector-icons/Entypo': 'react-native-vector-icons/Entypo.js',
    'react-native-vector-icons/EvilIcons': 'react-native-vector-icons/EvilIcons.js',
    'react-native-vector-icons/FontAwesome': 'react-native-vector-icons/FontAwesome.js',
    'react-native-vector-icons/Foundation': 'react-native-vector-icons/Foundation.js',
    'react-native-vector-icons/Ionicons': 'react-native-vector-icons/Ionicons.js',
    'react-native-vector-icons/MaterialIcons': 'react-native-vector-icons/MaterialIcons.js',
    'react-native-vector-icons/Octicons': 'react-native-vector-icons/Octicons.js',
    'react-native-vector-icons/Zocial': 'react-native-vector-icons/Zocial.js',
    'react-native-grid-view': 'react-native-grid-view/index.js',
    'react-native-video': 'react-native-video/Video.ios.js',
    'react-native-youtube': 'react-native-youtube/YouTube.ios.js',
    'react-native-motion-manager': 'react-native-motion-manager/index.js',
  },

  SUPPORTED_ASSETS: [
    'png',
    'jpg',
    'gif',
  ],
};
