/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    config = require('../common/config'),
    cordova = require('../cordova').cordova,
    cordovaLib = require('../cordova').lib,
    network = require('./util/network'),
    shell = require('shelljs'),
    path = require('path'),
    util = require('util'),
    fs = require('fs');

var CordovaCreate = require('cordova-create');

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
 *     - `name` {String} is the application name (default: 'helloworld')
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
    options.name = options.name || 'helloworld';
    options.id = options.id || 'com.phonegap.helloworld';

    // create app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

CreateCommand.prototype.execute = function(options, callback) {
    var self = this;
    var cfg;            // Create config
    var customWww;      // Template path
    var wwwCfg;         // Template config

    // if exists, use the JSON object in options.config to init the config
    if (options.config && Object.keys(options.config).length > 0) {
        cfg = options.config;
    } else {
        cfg = {};
    }

    customWww = options['copy-from'] || options.template;

    if (customWww) {
        if ((!options.template || !options['copy-from']) && customWww.indexOf('http') === 0) {
            var error = new Error('Only local paths for custom www assets are supported: ' + customWww);
            callback(error);
            self.phonegap.emit('error', error);
        }

        // Resolve tilda
        if (customWww.substr(0,1) === '~')
            customWww = path.join(process.env.HOME,  customWww.substr(1));

        wwwCfg = {
            url: customWww,
            template: false
        };

        if (options.template) {
            wwwCfg.template = true;
        } else if (args['copy-from']) {
            self.phonegap.emit('warn', '--copy-from option is being deprecated. Consider using --template instead.');
            wwwCfg.template = true;
        }

        cfg.lib = cfg.lib || {};
        cfg.lib.www = cfg.lib.www || wwwCfg;
    }
    try {
        CordovaCreate(options.path, options.id, options.name, cfg);
    } catch (err) {
        callback(err);
        err.message = 'PhoneGap received an error from the Cordova Create:\n' + err.message;
        self.phonegap.emit('error', err);
    }
    return this.phonegap;
    
};

/*!
 * Check if external project template declared in options.
 *
 * An external template is a template that is not included in package.json.
 */

function declaresExternalTemplate(options) {
    // return true if a template is delcared in the options
    return (
        options['copy-from'] ||
        options['link-to'] ||
        (
            options.config &&
            options.config.lib &&
            options.config.lib.www
        )
    );
}

/*!
 * Get Template Info.
 *
 * Attempts to get the template information and generates the UUID used by
 * Cordova's fetching system.
 *
 * If an error occurs, an error object is returned instead.
 *
 * Returns:
 *
 *   {Object | Error}
 */

function getTemplateInfo(name) {
    var templates = require('../../package.json').templates,
        template;

    try {
        template = templates[name].npm;
    }
    catch(e) {
        // return null for non-string values otherwise the name
        template = (typeof name === 'string') ? name : undefined;
    }

    return template;
}
