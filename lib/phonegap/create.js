/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
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

    // validate options.template
    options.template = (typeof options.template === 'string') ? options.template : null;

    // skip when the user links to an external template,
    // otherwise use the default Hello World template or a specified one.
    if (!declaresExternalTemplate(options)) {
        // create app using a user-defined or default template
        options.template = getTemplateInfo(options.template || 'hello-world');
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

    // use --template if it exists
    if (options.template) {
        cordovaCommand += ' --template="%s"'.replace('%s', options.template);
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
<<<<<<< HEAD
            else {
                self.phonegap.emit('warn', 'could not update ' + configXML.projectpath);
            }
        }

        callback(e);
=======
            throw err;
        });
    }).then(function () {
        // Find the latest version of Cordova published
        var cordovaVersionCommand = 'npm show cordova version';
        // Find the system version of Cordova installed //To/Do: handle dev version case
        //var cordovaVersionCommand = 'cordova -v'

        var deferred = Q.defer();
        shell.exec(cordovaVersionCommand, {silent:true}, function(code, stdout, stderr) {
            if (code != 0) {
                e = new Error('using npm to check cordova version: '+ stdout.replace('\n',''));
                self.phonegap.emit('error', '\033[1m \033[31m Error from PhoneGap Create: ' + e.message);
                if (options.verbose) {
                    console.trace();
                }
                deferred.reject(e);
            } else {
                self.phonegap.emit('verbose', 'Project using Cordova '+ stdout.replace('\n',''))
                deferred.resolve(stdout.replace('\n',''));
            }
        });
        return deferred.promise;
    }).then(function(cordovaVersion){
        var pkgJsonPath = path.resolve(options.path, 'package.json');
        var configPath = path.resolve(options.path, 'config.xml'); //Cordova Create will create or move config.xml to project root
        var pkgjson;
        // Update package.json; create it if does not exist
        if (!fs.existsSync(pkgJsonPath)) {
            self.phonegap.emit('warn', 'No package.json was found for your project. Creating one from config.xml');
            var config = new ConfigParser(configPath);
            pkgjson = {};
            pkgjson.name = (config.name() || path.basename(options.path)).toLowerCase();
            //ToDo: @carynbear validate npm package name
            pkgjson.version = config.version() || '1.0.0';
            pkgjson.dependencies = {
                "cordova" : "^"+cordovaVersion
            };
            fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgjson, null, 4), 'utf8');
        } else {
            pkgjson = require(pkgJsonPath);
            pkgjson.dependencies = pkgjson.dependencies || {};
            util._extend(pkgjson.dependencies, {"cordova" : "^"+cordovaVersion});
            fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgjson, null, 4), 'utf8');
        }
        callback(undefined);
    }).fail(function(err){
        self.phonegap.emit('warn', 'PhoneGap Create failed.');
        callback(err);
>>>>>>> parent of c4d68bf... Decoupled shelling out to project version of cordova
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
