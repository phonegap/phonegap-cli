/*!
 * Module dependencies.
 */

var cordova = require('cordova'),
    shell = require('shelljs'),
    path = require('path');

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
 *   {PhoneGap} instance for chaining.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.path) throw new Error('requires option.path parameter');

    // optional callback
    callback = callback || function() {};

    // expand path
    options.path = path.resolve(options.path);

    // create app
    execute.call(this, options, callback);

    return this;
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

module.exports.updateProject = function(options) {
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

var execute = function(options, callback) {
    var self = this;

    // create local project
    try {
        cordova.create(options.path);

        // use phonegap hello world
        module.exports.updateProject(options);

        self.emit('log', 'created project at', options.path);
        callback(null);
    }
    catch(err) {
        // workaround because cordova-cli throws String and Error objects.
        // CB-2733 has fixed the inconsistencies. This will be live on the
        // next published release of cordova-cli.
        var e = (err instanceof Error) ? err : new Error(err);
        self.emit('err', e.message);
        callback(e);
    }
};
