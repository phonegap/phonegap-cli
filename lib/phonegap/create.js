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
 *     - `name` {String} is the application name (default: 'Hello World')
 *     - `id` {String} is the package name (default: 'com.phonegap.hello-world')
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

    // validate options
    options.path = path.resolve(options.path);
    options.name = options.name || 'HelloWorld';
    options.id = options.id || 'com.phonegap.helloworld';

    // create app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

CreateCommand.prototype.execute = function(options, callback) {
    var self = this,
        version = self.phonegap.version().phonegap,
        uri = 'https://github.com/phonegap/phonegap-app-hello-world/archive/' +
              version + '.tar.gz';

    // customize default app
    cordova.config(options.path, {
        lib: {
            www: {
                id: 'phonegap',
                version: version,
                uri: uri
            }
        }
    });

    // create local project
    cordova.create(options.path, options.id, options.name, function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        self.phonegap.emit('log', 'created project at', options.path);
        callback(null);
    });
};
