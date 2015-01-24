/*!
 * Module dependencies.
 */

var phonegap = require('../main');

/**
 * $ phonegap template list
 *
 * Lists availabe app templates.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is null unless there is an error.
 */

module.exports = function(argv, callback) {
    phonegap.template.list({}, function(e, data) {
        // calculate the width of the name row.
        // the width minus the current name will give us the indentation width
        // to align the names and descriptions
        var maxLength = 0;
        data.templates.forEach(function(template) {
            maxLength = Math.max(maxLength, template.name.length);
        });
        maxLength += 4; // space between the longest name and description

        // display all templates
        data.templates.forEach(function(template) {
            var indent = new Array(maxLength - template.name.length).join(' ');
            phonegap.emit('raw', template.name + indent + template.description);
        });

        callback();
    });
};
