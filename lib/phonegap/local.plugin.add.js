/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    cordova = require('cordova'),
    pluralize = require('pluralize'),
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new LocalPluginAddCommand(phonegap);
    }
};

function LocalPluginAddCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(LocalPluginAddCommand, Command);

/**
 * Add a Plugin Locally.
 *
 * Add a plugin on the local system.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `path` {Array} is a list of local or remote URIs to the plugin.
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

LocalPluginAddCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.path) throw new Error('requires option.path parameter');

    // optional callback
    callback = callback || function() {};

    // add plugin
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

LocalPluginAddCommand.prototype.execute = function(options, callback) {
    var self = this,
        pluginString = pluralize('plugin', options.path.length);

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // validate parameters
    if (options.path.length < 1) {
        var e = new Error('missing a plugin path to add');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // list plugins being added
    for(var key in options.path) {
        self.phonegap.emit('log', 'adding the plugin:', options.path[key]);
    }

    // add plugin
    cordova.plugin('add', options.path, function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        self.phonegap.emit('log', 'successfully added the', pluginString);
        callback(null);
    });
};
