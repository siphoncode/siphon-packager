
require('react-native');
require('react-native-camera');
require('react-native-circular-progress');
require('react-native-contacts');
require('react-native-device-info');
require('react-native-fbsdk');
require('react-native-fs');
require('react-native-grid-view');
require('react-native-linear-gradient');
require('react-native-maps');
require('react-native-material-kit');
require('react-native-vector-icons');
require('react-native-vector-icons/Entypo');
require('react-native-vector-icons/EvilIcons');
require('react-native-vector-icons/FontAwesome');
require('react-native-vector-icons/Foundation');
require('react-native-vector-icons/Ionicons');
require('react-native-vector-icons/MaterialIcons');
require('react-native-vector-icons/Octicons');
require('react-native-vector-icons/Zocial');
require('react-native-video');
require('superagent');
require('underscore');

var SPLog = require('NativeModules').SPLog;
var __nativeLoggingHook = global.nativeLoggingHook;
global.nativeLoggingHook = function(s, logLevel) {
  __nativeLoggingHook(s, logLevel);
  SPLog.log(s);
};

module.exports = {};
