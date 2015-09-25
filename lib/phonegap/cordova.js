/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    cordova = require('../cordova'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new CordovaCommand(phonegap);
    }
};

function CordovaCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(CordovaCommand, Command);

/**
 * Execute a Cordova command.
 *
 * Execute an arbitrary Cordova CLI command.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `cmd` {String} is the exact Cordova command to execute.
 *     - `verbose` {Boolean} enables verbose output (cordova output).
 *   - [`callback`] {Function} is triggered after executing the command.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

CordovaCommand.prototype.run = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.cmd) throw new Error('requires option.cmd parameter');

    // default options.verbose
    if (isCustomCommand(options)) {
        // these commands can be silenced or verbose
        // first, do whatever the user specified
        // if the user didn't specify, then assume silence
        options.verbose = options.verbose || false;
    }
    else {
        // all other commands must be verbose, since we don't know what they do
        options.verbose = true;
    }

    // optional callback
    callback = callback || function() {};

    // validate options
    if (!options.cmd.match(/^cordova/)) {
        throw new Error('options.cmd must execute cordova');
    }

    // enable implicit adding of platforms when they're missing
    self.addMissingPlatforms(options, function() {
        // inject phonegap.js into the platforms if it's referenced
        self.addPhoneGapJSWarning(options, function() {
            self.execute(options, callback);
        });
    });

    return this.phonegap;
};

/*!
 * Execute.
 */

CordovaCommand.prototype.execute = function(options, callback) {
    var self = this;

    // in order to shell out to the cordova dependency, we must first find
    // where the dependencies binary was installed.
    //
    // in npm < 3.x it is found in:
    //   - `phonegap/node_modules/.bin/cordova`
    //
    // in npm >= 3.x it is either flattened or found in a local node_modules:
    //   - `phonegap/node_modules/.bin/cordova`
    //   - `/node_modules/.bin/cordova`
    //     - where phonegap is found at `/node_modules/phonegap/`

    // first try to find the cordova binary for npm < 3.x
    var binPath = path.resolve(path.join(__dirname, '..', '..', 'node_modules', '.bin'));

    // second try to find the cordova binary for npm >= 3.x
    if (!fs.existsSync(path.join(binPath, 'cordova'))) {
        binPath = path.resolve(path.join(__dirname, '..', '..', '..', '.bin'));
    }

    var command = options.cmd.split(' ')[0],           // 'cordova' process name (it may change one day)
        cordovaCommand = path.join(binPath, command), // /path/to/node_modules/.bin/cordova
        execOptions = { async: true, silent: true },
        buffer = [];

    // support file paths that include a space character
    if (cordovaCommand.match(' ')) {
        cordovaCommand = '"' + cordovaCommand + '"';
    }

    // append the arguments and options onto the command
    cordovaCommand += ' ' + options.cmd.substring(command.length + 1);

    // output the command being excuted
    if (isCustomCommand(options)) {
        self.phonegap.emit('log', 'executing', '\''+options.cmd+'\'...');
    }

    // shell out the command to cordova
    var child = shell.exec(cordovaCommand, execOptions, function(code, output) {
        var e;
        if (code !== 0) {
            e = new Error('PhoneGap received an error from the Cordova CLI:\n' +
                          '  Command: ' + cordovaCommand + '\n' +
                          '  Exit code: ' + code);
            e.exitCode = code;

            // on an error, display the entire output log
            self.phonegap.emit('raw', buffer.join('\n'));
        }
        else {
            if (isCustomCommand(options)) {
                self.phonegap.emit('log', 'completed',
                                          '\''+options.cmd+'\'');
            }
        }
        callback(e);
    });

    child.stdout.on('data', function(data) {
        if (options.verbose) {
            self.phonegap.emit('raw', data);
        }
        else {
            buffer.push(data);
        }
    });

    child.stderr.on('data', function(data) {
        if (options.verbose) {
            self.phonegap.emit('raw', data);
        }
        else {
            buffer.push(data);
        }
    });
};

/**
 * Add Missing Platforms.
 *
 * There are a bunch of Cordova commands that require a platform to exist.
 * Since the user is running the command, we can assume that they want the
 * platform to be added to their application. So, why not just add it for them?
 *
 * Options:
 *
 *   - `options` {Object} is identical to the Cordova command input.
 *   - [`callback`] {Function} is triggered after executing the command.
 *     - `e` {Error} is null unless there is an error.
 */

CordovaCommand.prototype.addMissingPlatforms = function(options, callback) {
    var self = this;

    // crazy regex to match any command that requires a platform and the
    // list of platforms after the command. If the command is missing the
    // platforms, then this regex will fail. That failure is a good thing
    // because when the user doesn't list platforms, then we have nothing
    // to add.
    var match = options.cmd.match(/(prepare|compile|build|run|emulate) ([\w ]+)/);
    if (match) {
        // get a list of the platforms that need to be added to the project
        var cordovaAddCommand = 'cordova platform add --save ',
            projectRootPath = cordova.util.isCordova();

        // project root will be false if it is not a cordova directory
        if (!projectRootPath) {
            return callback(new Error('not a PhoneGap directory'));
        }

        var requestedPlatforms = match[2].trim().split(' '),
            installedPlatforms = cordova.util.listPlatforms(projectRootPath),
            missingPlatforms = diff(requestedPlatforms, installedPlatforms);

        if (missingPlatforms.length > 0) {
            cordovaAddCommand += missingPlatforms.join(' ');
            self.phonegap.cordova({
                cmd: cordovaAddCommand,
                verbose: options.verbose,
                internalCommand: true
            }, callback);
            return;
        }
    }

    callback();
};

/**
 * Add phonegap.js.
 *
 * For backwards-compatibility, we will continue to support phonegap.js
 * includes in the HTML file. Soon this will be deprecated.
 *
 * Options:
 *
 *   - `options` {Object} is identical to the Cordova command input.
 *   - [`callback`] {Function} is triggered after executing the command.
 *     - `e` {Error} is null unless there is an error.
 */

CordovaCommand.prototype.addPhoneGapJS = function(options, callback) {
    var self = this;

    var match = options.cmd.match(/(prepare|compile|build|run|emulate)[ ]*([\w ]*)/);
    if (match) {
        // get a list of the platforms that need to be added to the project
        var projectRootPath = cordova.util.isCordova(),
            requestedPlatforms = match[2].trim().split(' ');

        // project root will be false if it is not a cordova directory
        if (!projectRootPath) {
            return callback(new Error('not a PhoneGap directory'));
        }

        // if no platforms were provided, then use all of the platforms
        // the regex will often match an empty string if there is trailing
        // whitespace, which is why there is the second comparison
        if (requestedPlatforms.length <= 0 || requestedPlatforms[0] === '') {
            requestedPlatforms = cordova.util.listPlatforms(projectRootPath);
        }

        // for each platform, inject phonegap.js
        requestedPlatforms.forEach(function(platform) {
            var platformPath = path.join(projectRootPath, 'platforms', platform, 'platform_www'),
                cordovaJSPath = path.join(platformPath, 'cordova.js'),
                phonegapJSPath = path.join(platformPath, 'phonegap.js');

            if (fs.existsSync(cordovaJSPath)) {
                self.phonegap.emit('log', 'adding phonegap.js to the ' + platform + ' platform');
                shell.cp('-f', cordovaJSPath, phonegapJSPath);
            }
        });
    }

    callback();
};

/**
 * Add phonegap.js DEPRECATION warning.
 *
 * Display DEPRECATION warning when the app references phonegap.js
 *
 * Options:
 *
 *   - `options` {Object} is identical to the Cordova command input.
 *   - [`callback`] {Function} is triggered after executing the command.
 *     - `e` {Error} is null unless there is an error.
 */

CordovaCommand.prototype.addPhoneGapJSWarning = function(options, callback) {
    var self = this;

    var match = options.cmd.match(/(prepare|compile|build|run|emulate)/);
    if (match) {
        // search HTML files for phonegap.js references
        var projectRootPath = cordova.util.isCordova();

        // project root will be false if it is not a cordova directory
        if (!projectRootPath) {
            return callback(new Error('not a PhoneGap directory'));
        }

        var htmlGlob = path.join(projectRootPath, 'www', '*.html'),
            matchedFiles = shell.grep('phonegap.js', htmlGlob).trim();

        if (matchedFiles.length > 0) {
            self.phonegap.emit('warn', 'phonegap.js support will soon be removed.');
            self.phonegap.emit('warn', 'please replace \'phonegap.js\' references with \'cordova.js\'');

            self.addPhoneGapJS(options, callback);
        }
        else {
            callback();
        }
    }
    else {
        callback();
    }
};

/*!
 * Return elements that are different between both arrays.
 *
 * If used elsewhere, we should consider extending the Array with:
 *     Array.prototype.diff = function(array2) { ... );
 */

function diff(array1, array2) {
    return array1.filter(function(i) {
        return array2.indexOf(i) < 0;
    });
}

/*!
 * Custom Command Check
 *
 * Some Cordova commands, we intercept and provide additional functionality.
 * This method abstracts the checking of those commands.
 *
 * Options:
 *
 *   - `options` {Object} same and provided to the CordovaCommand instance.
 *
 * Returns:
 *
 *   {Boolean}
 */

function isCustomCommand(options) {
    // default options.verbose
    return (options.internalCommand ||
            options.cmd.match(/(prepare|compile|build|run|emulate)/));
}
