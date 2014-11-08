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

    // optional callback
    callback = callback || function() {};

    // validate options
    if (!options.cmd.match(/^cordova/)) {
        throw new Error('options.cmd must execute cordova');
    }

    // enable implicit adding of platforms when they're missing
    self.addMissingPlatforms(options, function(e) {
        if (e) {
            return callback(e);
        }
        // inject phonegap.js into the platforms
        self.addPhoneGapJS(options, function(e) {
            if (e) {
                return callback(e);
            }
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

    // use the local cordova node module
    // later on, we could alter this section to load the global cordova module
    var binPath = path.join(__dirname, '..', '..', 'node_modules', '.bin'),
        cordovaCommand = path.join(binPath, options.cmd),
        execOptions = { async: true, silent: true };

    // shell out the command to cordova
    var child = shell.exec(cordovaCommand, execOptions, function(code, output) {
        var e;
        if (code !== 0) {
            e = new Error('PhoneGap received an error from the Cordova CLI:\n' +
                          '  Command: ' + cordovaCommand + '\n' +
                          '  Exit code: ' + code + '\n');
            e.exitCode = code;
        }
        callback(e);
    });

    child.stdout.on('data', function(data) {
        self.phonegap.emit('raw', data);
    });

    child.stderr.on('data', function(data) {
        self.phonegap.emit('raw', data);
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
    var match = options.cmd.match(/(prepare|compile|build|run|emulate) ([\w ]*)/);
    if (match) {
        // get a list of the platforms that need to be added to the project
        var cordovaAddCommand = 'cordova platform add ',
            projectRootPath = cordova.util.isCordova(),
            requestedPlatforms = match[2].trim().split(' '),
            installedPlatforms = cordova.util.listPlatforms(projectRootPath),
            missingPlatforms = diff(requestedPlatforms, installedPlatforms);

        if (missingPlatforms.length > 0) {
            self.phonegap.emit('log', 'adding the platforms: ' + missingPlatforms.join(', '));
            cordovaAddCommand += missingPlatforms.join(' ');
            self.phonegap.cordova({ cmd: cordovaAddCommand }, callback);
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
