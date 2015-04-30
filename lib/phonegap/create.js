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
        template = {};

    // skip when the user links to an external template,
    // otherwise use the default Hello World template or a specified one.
    if (!declaresExternalTemplate(options)) {
        // create app using a user-defined or default template
        template = getTemplateInfo(options.template || 'hello-world');
        if (template instanceof Error) {
            var e = template;
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        // tell cordova to setup the template
        /* Currently broken in cordova-lib 5.0.0
        cordova.config(options.path, {
            lib: {
                www: {
                    id: template.id,
                    version: template.version,
                    uri: template.url,
                    link: false
                }
            }
        });
        */

        //workaround for templating
        //set optoins.config.lib to equal values for our template, pass this 
        //in below to cordova create command
        var templateConfig = {
            lib: {
                www: {
                    id: template.id,
                    version: template.version,
                    uri: template.url,
                    link: false
                }
            }
        };

        options.config = options.config || templateConfig;
        options.config.lib = options.config.lib || templateConfig.lib;
        if(options.config.lib){
            options.config.lib.www = options.config.lib.www || templateConfig.lib.www;
        }
    }

    // validate options.config
    // ignore objects with no properties `{}` because this cleans up
    // the cordova-cli calls and prevents unexpected errors since thec
    // cordova-cli expects the config to always be the fourth argument.
    if (options.config && Object.keys(options.config).length > 0) {
        // the config argument is a JSON string, which means it must be properly
        // escaped for the command-line
        options.config = JSON.stringify(options.config).replace(/"/g, '\\"');
    }
    else {
        options.config = undefined;
    }


    // construct the cordova create command
    var cordovaCommand = 'cordova create';
    [ options.path, options.id, options.name, options.config ].forEach(function(value) {
        if (typeof value !== 'undefined') {
            cordovaCommand += ' "$value"'.replace('$value', value);
        }
    });

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

        // do not alter linked projects
        if (!options['link-to']) {
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
        }

        callback(e);
    });
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
        template = {};

    try {
        template.url = templates[name].url;
        template.version = 'master';
        template.id = name + '-template';
    }
    catch(e) {
        template = new Error('the template "' + name + '" was not found');
    }

    return template;
}
