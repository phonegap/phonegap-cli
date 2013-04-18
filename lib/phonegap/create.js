/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    cordova = require('cordova'),
    shell = require('shelljs'),
    path = require('path'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new CreateCommand(phonegap);
    }
};

function CreateCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(CreateCommand, Command);

/**
 * Create a New App.
 *
 * Creates an project on the local filesystem.
 * This project is backwards compatible with Apache Cordova projects.
 *
 * Options:
 *
 *   - `options` {Object} is data required to create an app
 *     - `path` {String} is a directory path for the app.
 *   - [`callback`] {Function} is triggered after creating the app.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

CreateCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.path) throw new Error('requires option.path parameter');

    // optional callback
    callback = callback || function() {};

    // expand path
    options.path = path.resolve(options.path);

    // create app
    this.execute(options, callback);

    return this.phonegap;
};

/**
 * Replace Cordova Project with PhoneGap Project.
 *
 * This function can be removed once cordova-cli supports external projects.
 *
 * Options:
 *
 *   - `options` {Object}
 *   - `options.path` {String} is the project path.
 */

CreateCommand.prototype.updateProject = function(options) {
    var destinationPath = path.join(options.path, 'www'),
        sourcePath = path.join(
            __dirname, '..', '..',
            'node_modules', 'phonegap-build', 'res', 'project-template', 'www'
        );

    shell.rm('-r', destinationPath);
    shell.cp('-r', sourcePath, options.path);
};

/*!
 * Execute.
 */

CreateCommand.prototype.execute = function(options, callback) {
    // create local project
    try {
        cordova.create(options.path);

        // use phonegap hello world
        this.updateProject(options);

        this.phonegap.emit('log', 'created project at', options.path);
        callback(null);
    }
    catch(e) {
        this.phonegap.emit('error', e);
        callback(e);
    }
};
