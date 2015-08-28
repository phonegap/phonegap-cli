/*
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    shell = require('shelljs');

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
        // when the file does not exist, return an empty data object
        data = JSON.parse(data || '{}');
        callback(null, data);
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

    // create the directory path when it does not exist
    shell.mkdir('-p', path.dirname(filepath));

    fs.writeFile(filepath, JSON.stringify(data), function(e) {
        callback(e);
    });
};
