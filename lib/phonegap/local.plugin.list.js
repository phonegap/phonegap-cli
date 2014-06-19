/*!
 * Module dependencies
 */

var Command = require('./util/command'),
    project = require('./util/project'),
    cordova = require('cordova-lib').cordova,
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new LocalPluginListCommand(phonegap);
    }
};

function LocalPluginListCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(LocalPluginListCommand, Command);

/**
 * List Plugins.
 *
 * List locally installed plugins.
 *
 * Options:
 *
 *   - `options` {Object}
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

LocalPluginListCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional callback
    callback = callback || function() {};

    // list plugins
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

LocalPluginListCommand.prototype.execute = function(options, callback) {
    var self = this;

    // change to project directory and delegate errors
    if (!project.cd({ emitter: self.phonegap, callback: callback })) return;

    // cordova returns the plugins through the 'results' event
    // this is an awkward workflow, but we will make it work.
    cordova.on('results', function listEventHandler(plugins) {
        cordova.removeListener('results', listEventHandler);
        self.listPlugins(plugins, callback);
    });

    // list plugins
    cordova.plugin('list');
};

LocalPluginListCommand.prototype.listPlugins = function(plugins, callback) {
    var self = this,
        e = null;

    // error is not supported by cordova, but this is for the future
    if (plugins instanceof Error) {
        e = plugins;
        plugins = [];
        self.phonegap.emit('error', e);
    } else if (typeof plugins === 'string') {
        // identify the "no plugins" response to phonegapify the output
        if (plugins.indexOf('No plugins added') > -1) {
            plugins = [];
            self.phonegap.emit('log', 'no plugins installed');
        }
        else {
            // list plugins
            self.phonegap.emit('log', 'the following plugins are installed\n'+plugins);
        }
    }
    callback(e, plugins);
};
