/*
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');

/*
* Load package.json.
*/

var packagePath = path.join(__dirname, '..', '..', 'package.json'),
    packageJSON = JSON.parse(fs.readFileSync(packagePath), 'utf8');

/**
 * Version command.
 *
 * Outputs the version to the console.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    console.log(packageJSON.version);
    callback();
};
