var cordova = require('cordova');

exports.commandExists = function(command) {
    return cordova.hasOwnProperty(command);
};

exports.command = function(command, options) {
    return cordova[command].apply(this, options);
};
