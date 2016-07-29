/**
 * DESCRIPTION:
 * This module previously exposed cordova within phonegap and had a direct usage with the util methods.
 * Now this module only has direct usage through util methods, or to handle CordovaEvents
 */

/*ToDo: @carynbear clean this up; cordova dependencies need to be removed; 
 * usage of cordova found in lib/phonegap/mode.js mainly involving cordova-common events
 * possible solution is to change those dependencies to interact with cordova-common directly
 */

/*!
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    cordova_events = require('cordova-common').events;

/**
 * Cordova CLI API (reduced down to just the methods of Cordova Events as used by mode.js).
 */
module.exports.cordova =
    {
        on:        function() {
            cordova_events.on.apply(cordova_events, arguments);
        },
        off:       off,
        removeListener:off,
        removeAllListeners:function() {
            cordova_events.removeAllListeners.apply(cordova_events, arguments);
        },
        emit:      emit,
        trigger:   emit,
        raw: {}
    };

var off = function() {
    cordova_events.removeListener.apply(cordova_events, arguments);
};

var emit = function() {
    cordova_events.emit.apply(cordova_events, arguments);
};

/**
 * Cordova Lib. ToDo: @carynbear clean this up
 */
//module.exports.lib = require('cordova').cordova_lib;

/* set the binary name of the Cordova CLI to phonegap */
//module.exports.lib.binname = require(path.join(__dirname, '..', '..', 'package.json')).name;

/**
 * Cordova Utility Module.
 *
 * We should consider exposing this interface in the cordova module.
 *
 * Until then, we will manually define the methods that we need to use.
 */

module.exports.util = {
    isCordova: require('cordova-common').CordovaCheck.findProjectRoot,
    //isCordova: require('cordova').cordova_lib.cordova.findProjectRoot, //ToDo: @carynbear clean this up; cordova-lib code moved to cordova-common

    // borrowed from the apache/cordova-lib utility implementation, since it is
    // not pubicly accessible:
    // https://github.com/apache/cordova-lib/blob/master/cordova-lib/src/cordova/util.js
    listPlatforms: function(project_dir) {
        var platforms_dir = path.join(project_dir, 'platforms');
        if ( !fs.existsSync(platforms_dir)) {
            return [];
        }
        var subdirs = fs.readdirSync(platforms_dir);
        return subdirs;
    }
};
