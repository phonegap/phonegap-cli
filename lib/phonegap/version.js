/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    util = require('util'),
    project = require('./util/project');

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
    // parse package.json
    var packageJSON = project.readPackage();

    // get version
    var version = packageJSON.version;

    // parse version types
    return {
        npm: version,
        phonegap: version.split('-')[0],
        module: version.split('-')[1]
    };
};
