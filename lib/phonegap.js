var cordova = require('cordova');

var phonegap = {
    'env': 'local'
};

//
// Set and Get the PhoneGap Environment
//
// @param  {String} type of environment: 'local' or 'remote'
// @return {String} current environment type
//
exports.env = function(type) {
    return (phonegap.env = (type || phonegap.env));
};

exports.commandExists = function(command) {
    return cordova.hasOwnProperty(command);
};

exports.command = function(command, options) {
    return cordova[command].apply(this, options);
};
