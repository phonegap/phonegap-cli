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
        return new LocalPluginRemoveCommand(phonegap);
    }
};

function LocalPluginRemoveCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(LocalPluginRemoveCommand, Command);

/**
 * Remove a Plugin Locally.
 *
 * Remove a plugin on the local system.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `id` {String} is the plugin id to remove.
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

LocalPluginRemoveCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.id) throw new Error('requires option.id parameter');

    // optional callback
    callback = callback || function() {};

    // remove plugin
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

LocalPluginRemoveCommand.prototype.execute = function(options, callback) {
    var self = this,
        pluginString = pluralize('plugin', options.id.length);

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // validate parameters
    if (options.id.length < 1) {
        var e = new Error('missing a plugin path to remove');
        self.phonegap.emit('error', e);
        callback(e);
        return;
    }

    // list plugins being removed
    for(var key in options.id) {
        self.phonegap.emit('log', 'removing the plugin:', options.id[key]);
    }

    // remove plugins
    cordova.plugin('remove', options.id, function(e) {
        if (e) {
            self.phonegap.emit('error', e);
            callback(e);
            return;
        }

        self.phonegap.emit('log', 'successfully removed the', pluginString);
        callback(null);
    });
};
