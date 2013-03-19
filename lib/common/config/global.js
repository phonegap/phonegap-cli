/*
 * Module dependencies.
 */

var shell = require('shelljs'),
    path = require('path'),
    fs = require('fs');

/**
 * Path to config directory.
 *
 * By default, the config is shared with PhoneGap's config at: ~/.phonegap/
 *
 * You can override this desired.
 */

module.exports.path = path.join(
    process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
    '.cordova'
);

/**
 * Load the config.
 *
 * Returns the content of configuration file.
 * The configuration file is found at `PATH/config.json`.
 * The value of `PATH` is defined by `config.path`.
 *
 * Options:
 *
 *   - `callback` {Function} is triggered with the config data.
 *     - `e` {Error} is null when there is no error.
 *     - `data` {Object} is the JSON content of configuration file.
 */

module.exports.load = function(callback) {
    // require callback
    if (!callback) {
        throw new Error('missing callback argument');
    }

    var filepath = path.join(module.exports.path, 'config.json');

    // check if config exists
    fs.exists(filepath, function(exists) {
        if (exists) {
            // read config file
            fs.readFile(filepath, function(e, data) {
                if (e) {
                    callback(e);
                    return;
                }

                // return config file object
                data = JSON.parse(data);
                data.phonegap = data.phonegap || {};
                callback(null, data);
            });
        }
        else {
            // create config file
            var data = { phonegap: {} };
            module.exports.save(data, function(e) {
                if (e) {
                    callback(e);
                    return;
                }

                // return config file object
                callback(null, data);
            });
        }
    });
};

/**
 * Save the config.
 *
 * Write the data object as a string to the configuration document.
 *
 * Options:
 *
 *   - `data` {Object} is the data to append to the config file.
 *   - `callback` {Function} is trigger after the save operation.
 *     - `e` {Error} is null when there is no error.
 */

module.exports.save = function(data, callback) {
    // require data
    if (!data) {
        throw new Error('missing data argument');
    }

    // require callback
    if (!callback) {
        throw new Error('missing callback argument');
    }

    var filepath = path.join(module.exports.path, 'config.json');

    // create the path
    shell.mkdir('-p', path.dirname(filepath));

    // write to config file
    fs.writeFile(filepath, JSON.stringify(data), function(e) {
        callback(e);
    });
};
