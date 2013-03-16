/*
 * Module dependencies.
 */

var path = require('path'),
    fs = require('fs');

/**
 * Load the project configuration file.
 *
 * Loads the project configuration file as a JSON object.
 *
 * Options:
 *
 *   - `callback` {Function} is triggered after loading the configuration file.
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object} is a JSON representation of the configuration file.
 */

module.exports.load = function(callback) {
    // require callback parameter
    if (!callback) throw new Error('missing callback parameter');

    var filepath = path.join(process.cwd(), '.cordova', 'config.json');

    fs.readFile(filepath, function(e, data) {
        if (data) {
            data = JSON.parse(data);
        }

        callback(e, data);
    });
};

/**
 * Save the project configuration file.
 *
 * Saves the project configuration file as a stringified representation of
 * the JSON object.
 *
 * Options:
 *
 *   - `data` {Object} is the configuration data to save.
 *   - `callback` {Object} is trigger after the file is saved.
 *     - `e` {Error} is null unless there is an error.
 */

module.exports.save = function(data, callback) {
    // required parameters
    if (!data) throw new Error('missing data parameter');
    if (!callback) throw new Error('missing callback parameter');

    var filepath = path.join(process.cwd(), '.cordova', 'config.json');

    fs.writeFile(filepath, JSON.stringify(data), function(e) {
        callback(e);
    });
};
