/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    cordova = require('../cordova').cordova,
    cordovaLib = require('../cordova').lib,
    path = require('path'),
    util = require('util'),
    fs = require('fs');

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
 *     - `config` {Object} is a JSON configuration object (default: {})
 *     - `link-to` {String} is a path to a project to link (default: undefined)
 *     - `copy-from` {String} is a path to a project to copy (default: undefined)
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
    options.name = options.name || 'Hello World';
    options.id = options.id || 'com.phonegap.hello-world';
    options.config = options.config || {};

    // create app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

CreateCommand.prototype.execute = function(options, callback) {
    var self = this,
        version = 'master',
        url = 'https://github.com/phonegap/phonegap-app-hello-world/archive/' + version + '.tar.gz';

    // use the phonegap hello world app template,
    // unless the user has specified a custom template.
    if (!declaresTemplate(options)) {
        cordova.config(options.path, {
            lib: {
                www: {
                    id: 'com.phonegap.hello-world',
                    version: version,
                    uri: url,
                    link: false
                }
            }
        });
    }

    // the config argument is a JSON string, which means it must be properly
    // escaped for the command-line
    var configString = JSON.stringify(options.config).replace(/"/g, '\\"');

    // construct the cordova create command
    var cordovaCommand = 'cordova create "$path" "$id" "$name" "$config"';
    cordovaCommand = cordovaCommand.replace('$path', options.path)
                                   .replace('$id', options.id)
                                   .replace('$name', options.name)
                                   .replace('$config', configString);

    // use --copy-from (or -src) if it existed in the original command
    if (options['copy-from']) {
        cordovaCommand += ' --copy-from="%s"'.replace('%s', options['copy-from']);
    }

    // use --link-to if it existed in the original command
    if (options['link-to']) {
        cordovaCommand += ' --link-to="%s"'.replace('%s', options['link-to']);
    }

    // use cordova to create the project from the command-line
    self.phonegap.cordova({ cmd: cordovaCommand }, function(e) {
        if (e) {
            // do not emit this error because it'll be handled by
            // the `phonegap.cordova` function.
            callback(e);
            return;
        }

        var configXML = {
            projectPath: path.join(options.path, 'config.xml'),
            wwwPath: path.join(options.path, 'www', 'config.xml')
        };

        // move config.xml to root of project for legacy app templates
        if (fs.existsSync(configXML.wwwPath)) {
            fs.renameSync(configXML.wwwPath, configXML.projectPath);
        }

        // update config.xml with app info
        if (fs.existsSync(configXML.projectPath)) {
            var configParser = new cordovaLib.configparser(configXML.projectPath);
            configParser.setPackageName(options.id);
            configParser.setName(options.name);
            configParser.write();
        }
        else {
            self.phonegap.emit('warn', 'could not update ' + configXML.projectpath);
        }

        callback(e);
    });
};

/*!
 * Check if project template declared in options.
 *
 * Helper method to do as the title states.
 */

function declaresTemplate(options) {
    // return true if a template is delcared in the options
    return (
        options['copy-from'] ||
        options['link-to'] ||
        (
            options.config.lib &&
            options.config.lib.www
        )
    );
}
