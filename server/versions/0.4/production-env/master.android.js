
require('react-native');
require('underscore');
require('superagent');
require('react-native-vector-icons/Entypo');
require('react-native-vector-icons/EvilIcons');
require('react-native-vector-icons/FontAwesome');
require('react-native-vector-icons/Foundation');
require('react-native-vector-icons/Ionicons');
require('react-native-vector-icons/MaterialIcons');
require('react-native-vector-icons/Octicons');
require('react-native-vector-icons/Zocial');
require('react-native-grid-view');
require('react-native-video');
require('react-native-camera');
require('react-native-device-info');
require('react-native-linear-gradient');
require('react-native-fs');
require('react-native-material-kit');

var SPLog = require('NativeModules').SPLog;
var __nativeLoggingHook = global.nativeLoggingHook;
global.nativeLoggingHook = function(s, logLevel) {
  __nativeLoggingHook(s, logLevel);
  SPLog.log(s);
};

module.exports = {};
