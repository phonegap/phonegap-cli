/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    cordova = require('cordova'),
    cdvlib = require('cordova-lib'),
    ConfigParser = require('cordova-lib').configparser,
    shell = require('shelljs'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

/**
 * localization of human readable log messages
 * eventual migration to its own module
 */
var PG_STR = {
    'created' : 'created project at',
    'args' : 'create called with the options',
    'custconfig' : 'Customizing default config.xml file',
};

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
    options.path = path.resolve(options.path.toString());

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
                id: options.id,
                version: version,
                uri: uri
            }
        }
    });

    // create local project
    cordova.create(options.path, options.id, options.name, function(e) {
        var cfgPath = path.join(options.path, 'www', 'config.xml'),
            cfgParser = null;

        self.phonegap.emit('log',PG_STR['args'], options.path, options.id, options.name);

        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        // Write out id and name to config.xml
        if(fs.existsSync(cfgPath)) {

            self.phonegap.emit('log',PG_STR['custconfig']);

            cfgParser = new ConfigParser(cfgPath);
            cfgParser.setPackageName(options.id);
            cfgParser.setName(options.name);
            cfgParser.write();
        }

        self.phonegap.emit('log', PG_STR['created'], options.path);
        callback(null);
    });

};
