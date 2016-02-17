/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    util = require('util'),
    opener = require('./util/opener');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new TemplateSearchCommand(phonegap);
    }
};

function TemplateSearchCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(TemplateSearchCommand, Command);

/**
 * Search the available templates.
 *
 * At the moment, there is no way to filter templates by name. Instead,
 * we must show all templates that use the keyword `cordova:template`.
 * The Apache Cordova project will be adding template search functionality
 * to their plugin website soon.
 *
 * Options:
 *
 *   - `options` {Object} is currently unused (but required for consistency).
 *   - [`callback`] {Function} is triggered after completion
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object}
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

TemplateSearchCommand.prototype.run = function(options, callback) {
    var self = this,
        data = {};

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // npmjs.com URL to filter by keyword
    var url = 'https://www.npmjs.com/browse/keyword/cordova:template';

    // open the URL to filter by keywords. This isn't ideal, but it's
    // the best that we can do until Apache Cordova improves plugins.cordova.io
    opener.open(url);

    // trigger async callback
    process.nextTick(function() {
        callback(null, data);
    });

    return self.phonegap;
};
