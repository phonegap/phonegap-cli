/*!
 * Module dependencies.
 */

var prompt = require('prompt');

/**
 * Console Log.
 *
 * Passes the parameters to `console.log`.
 *
 * Outputs:
 *
 *     $ [phonegap] message
 */

module.exports.log = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[phonegap]'.cyan);
    console.log.apply(this, format(args, '[phonegap]'.cyan));
};

/**
 * Console Warning.
 *
 * Passes the parameters to `console.warn`.
 *
 * Outputs:
 *
 *     $ [warning] message
 */

module.exports.warn = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(' [warning]'.yellow);
    console.log.apply(this, format(args, ' [warning]'.yellow));
};

/**
 * Console Error.
 *
 * Passes the parameters to `console.error`.
 *
 * Outputs:
 *
 *     $ [error] message
 */

module.exports.error = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('   [error]'.red);
    console.log.apply(this, format(args, '   [error]'.red));
};

/**
 * Console Prompt.
 *
 * Prompts for a value.
 *
 * Outputs:
 *
 *     $ [prompt] message:
 */

module.exports.prompt = function(options, callback) {
    // prompt setup
    prompt.override = options.override;
    prompt.colors = false;
    prompt.message = '  [prompt]'.green;
    prompt.delimiter = ' ';
    prompt.start();

    // begin prompting
    prompt.get(options.data, callback);
};

/**
 * RAW Console Log.
 *
 * Passes the parameters to `console.log` with no prefix.
 *
 * Outputs:
 *
 *     $ message
 */

module.exports.raw = function() {
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(this, args);
};

/**
 * Format Multiline Messages.
 *
 * Some messages will have newlines embedded within the message.
 * The formatter can correctly display these messages by calling:
 *
 *     format(messages, '[phonegap]');
 *
 * Options:
 *
 *   - `args` {Array} of `String` elements to output.
 *   - `prefix` {String} is prepended to each new line of the output.
 *
 * Returns:
 *
 *   {Array} of the correctly formatted args.
 */

function format(args, prefix) {
    for(var i = 0, l = args.length; i < l; i++) {
        if (typeof args[i] == 'string') {
            args[i] = args[i].replace(/\n/g, new FormatMatcher(prefix));
        }
    }
    return args;
}

function FormatMatcher(prefix) {
    return function formatMatcher(match, p1) {
        return '\n' + prefix + ' ';
    };
}
