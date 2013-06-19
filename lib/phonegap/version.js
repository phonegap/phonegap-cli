/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new VersionCommand(phonegap);
    }
};

function VersionCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(VersionCommand, Command);

/**
 * Version reporter.
 *
 * Report the version of npm package, npm module, or PhoneGap.
 *
 * Example:
 *
 *   => 2.8.0-0.10.6
 *
 *   {
 *       npm:      '2.8.0-0.10.6',
 *       module:   '0.10.6',
 *       phonegap: '2.8.0'
 *   }
 *
 * Returns:
 *
 *   {Object} that contains the versions.
 */

VersionCommand.prototype.run = function(options, callback) {
    // load package.json
    var packagePath = path.join(__dirname, '..', '..', 'package.json'),
        packageJSON = JSON.parse(fs.readFileSync(packagePath), 'utf8');

    // get version
    var version = packageJSON.version;

    // parse version types
    return {
        npm: version,
        phonegap: version.split('-')[0],
        module: version.split('-')[1]
    };
};
