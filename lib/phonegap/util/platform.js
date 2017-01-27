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
        remote: null,
        human: 'Windows Phone 7'
    },
    wp8: {
        local: 'wp8',
        remote: 'winphone',
        human: 'Windows Phone 8'
    },
    windows: {
        local: 'windows',
        remote: 'windows',
        human: 'Windows'
    },
    firefoxos: {
        local: 'firefoxos',
        remote: null,
        human: 'Firefox OS'
    }
};

/**
 * check to see if a given set of platform labels are supported
 *
 * @param platforms to check, can be a platform label string or an array of platform label strings
 * @return array of valid platforms
 */
module.exports.supports = function (platforms) {
    var results = [];
    var supported = module.exports.map;
    var check = function(value) {
        for (var i in supported) {
            var plat = supported[i];
            if (plat.local === value) {
                return true;
            }
        }
        return false;
    };

    if (!platforms.length) {
        if (check(platforms)) {
            results.push(platforms);
        };
    } else {
        results = platforms.filter(function(value) {
            return check(value);
        });
    }
    return results;
};
