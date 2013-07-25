/*!
 * Module dependencies.
 */

/**
 * Get Platform Names for each Environment.
 *
 * Options:
 *
 *   - `platforms` {Array} of {String} platform keywords.
 *
 * Returns:
 *
 *   - {Array} of {Object} that contain keywords for each environment.
 */

module.exports.names = function(platforms) {
    platforms = platforms || [];

    // filter out unsupported platforms
    platforms = platforms.filter(function(platform) {
        return module.exports.map[platform];
    });

    // map platform names
    return platforms.map(function(platform) {
        return module.exports.map[platform];
    });
};

/**
 * Platform Environment Names.
 *
 * Mapping:
 *   'local'  => cordova-cli
 *   'remote' => PhoneGap/Build
 *   'human'  => Human readable name
 */

module.exports.map = {
    android: {
        local: 'android',
        remote: 'android',
        human: 'Android'
    },
    blackberry: {
        local: 'blackberry10',
        remote: 'blackberry',
        human: 'BlackBerry'
    },
    ios: {
        local: 'ios',
        remote: 'ios',
        human: 'iOS'
    },
    wp7: {
        local: 'wp7',
        remote: 'winphone',
        human: 'Windows Phone 7'
    },
    wp8: {
        local: 'wp8',
        remote: null,
        human: 'Windows Phone 8'
    },
    symbian: {
	    local: null,
	    remote: 'symbian',
	    human: 'Symbian'
    }
};
