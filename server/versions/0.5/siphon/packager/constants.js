
module.exports = {

  BASE_VERSION: '0.5',

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
    'react-native': {
      ios: 'react-native/Libraries/react-native/react-native.js',
      android: 'react-native/Libraries/react-native/react-native.js',
    },
    'dismissKeyboard': {
      ios: 'dismissKeyboard',
      android: 'dismissKeyboard',
    },
    'Dimensions': {
      ios: 'Dimensions',
      android: 'Dimensions',
    },
    'EventEmitter': {
      ios: 'EventEmitter',
      android: 'EventEmitter',
    },
    'AssetRegistry': {
      ios: 'AssetRegistry',
      android: 'AssetRegistry',
    },
    'NativeModules': {
      ios: 'NativeModules',
      android: 'NativeModules',
    },
    'underscore': {
      ios: 'underscore/underscore.js',
      android: 'underscore/underscore.js',
    },
    'superagent': {
      ios: 'superagent/lib/client.js',
      android: 'superagent/lib/client.js',
    },
    'react-native-circular-progress': {
      ios: 'react-native-circular-progress/index.js',
      android: 'react-native-circular-progress/index.js',
    },
    'react-native-maps': {
      ios: 'react-native-maps/index.js',
      android: 'react-native-maps/index.js',
    },
    'react-native-vector-icons/Entypo': {
      ios: 'react-native-vector-icons/Entypo.js',
      android: 'react-native-vector-icons/Entypo.js',
    },
    'react-native-vector-icons/EvilIcons': {
      ios: 'react-native-vector-icons/EvilIcons.js',
      android: 'react-native-vector-icons/EvilIcons.js',
    },
    'react-native-vector-icons/FontAwesome': {
      ios: 'react-native-vector-icons/FontAwesome.js',
      android: 'react-native-vector-icons/FontAwesome.js',
    },
    'react-native-vector-icons/Foundation': {
      ios: 'react-native-vector-icons/Foundation.js',
      android: 'react-native-vector-icons/Foundation.js',
    },
    'react-native-vector-icons/Ionicons': {
      ios: 'react-native-vector-icons/Ionicons.js',
      android: 'react-native-vector-icons/Ionicons.js',
    },
    'react-native-vector-icons/MaterialIcons': {
      ios: 'react-native-vector-icons/MaterialIcons.js',
      android: 'react-native-vector-icons/MaterialIcons.js',
    },
    'react-native-vector-icons/Octicons': {
      ios: 'react-native-vector-icons/Octicons.js',
      android: 'react-native-vector-icons/Octicons.js',
    },
    'react-native-vector-icons/Zocial': {
      ios: 'react-native-vector-icons/Zocial.js',
      android: 'react-native-vector-icons/Zocial.js',
    },
    'react-native-grid-view': {
      ios: 'react-native-grid-view/index.js',
      android: 'react-native-grid-view/index.js',
    },
    'react-native-video': {
      ios: 'react-native-video/Video.js',
      android: 'react-native-video/Video.js',
    },
    'react-native-youtube': {
      ios: 'react-native-youtube/YouTube.ios.js',
      android: 'react-native-youtube/YouTube.android.js',
    },
    'react-native-motion-manager': {
      ios: 'react-native-motion-manager/index.js',
      android: null,
    },
    'react-native-camera': {
      ios: 'react-native-camera/index.ios.js',
      android: 'react-native-camera/index.android.js',
    },
    'react-native-device-info': {
      ios: 'react-native-device-info/deviceinfo.js',
      android: 'react-native-device-info/deviceinfo.js',
    },
    'react-native-fs': {
      ios: 'react-native-fs/FS.common.js',
      android: 'react-native-fs/FS.common.js',
    },
    'react-native-linear-gradient': {
      ios: 'react-native-linear-gradient/index.ios.js',
      android: 'react-native-linear-gradient/index.android.js',
    },
    'react-native-touch-id': {
      ios: 'react-native-touch-id/TouchID.ios.js',
      android: null,
    },
    'react-native-material-kit': {
      ios: 'react-native-material-kit/lib/index.js',
      android: 'react-native-material-kit/lib/index.js',
    },
    'react-native-contacts': {
      ios: 'react-native-contacts/index.js',
      android: 'react-native-contacts/index.js',
    },
    'react-native-fbsdk': {
      ios: 'react-native-fbsdk/js/index.js',
      android: 'react-native-fbsdk/js/index.js',
    },
  },

  // See https://github.com/facebook/react-native/blob/0.22-stable/\
  // packager/react-packager/src/Server/index.js for reference
  SUPPORTED_ASSETS: [
    'png', 'jpg', 'jpeg', 'gif', 'psd', 'svg', 'webp', // Image formats
  ],
};
