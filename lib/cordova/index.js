/**
 * DESCRIPTION:
 * This module previously exposed the Cordova API within phonegap/phonegap object and had the Cordova Lib util methods.
 * Now this module only has direct usage of util methods, or to handle CordovaEvents.
 */

/*!
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    cordova_events = require('cordova-common').events;

/**
 * Cordova CLI API (reduced down to just the methods of Cordova Events as used by mode.js).
 * @carynbear: this was copied from apache/cordova-lib to expose cordova_events. Previous was a require of cordova.
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
 * Cordova Utility Module.
 *
 * We should consider exposing this interface in the cordova module.
 *
 * Until then, we will manually define the methods that we need to use.
 */

module.exports.util = {
    isCordova: require('cordova-common').CordovaCheck.findProjectRoot,

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
