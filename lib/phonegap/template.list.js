/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    templates = require('../../package.json').templates,
    util = require('util');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new TemplateListCommand(phonegap);
    }
};

function TemplateListCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(TemplateListCommand, Command);

/**
 * List Available Templates.
 *
 * Lists the templates available to the user.
 *
 * Options:
 *
 *   - `options` {Object} is currently unused (but required for consistency).
 *   - [`callback`] {Function} is triggered after completion
 *     - `e` {Error} is null unless there is an error.
 *     - `data` {Object}
 *       - `templates` {Array} is a list of the template names
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

TemplateListCommand.prototype.run = function(options, callback) {
    var self = this;

    // require options
    if (!options) throw new Error('requires options parameter');

    // optional callback
    callback = callback || function() {};

    // collect the templates
    var data = { templates: [] };
    for (var key in templates) {
        var template = templates[key];
        template.name = key;
        data.templates.push(template);
    }

    // trigger async callback
    process.nextTick(function() {
        callback(null, data);
    });

    return self.phonegap;
};
