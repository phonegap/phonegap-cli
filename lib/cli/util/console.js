/*!
 * Module dependencies.
 */

var colors = require('colors'),
    prompt = require('prompt');

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
    console.log.apply(this, args);
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
    console.log.apply(this, args);
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
    console.log.apply(this, args);
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
