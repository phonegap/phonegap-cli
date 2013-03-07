/*!
 * Module dependencies.
 */

var cordova = require('cordova'),
    events = require('events'),
    path = require('path');

/**
 * Create a New App.
 *
 * Creates an application on the local filesystem.
 *
 * Options:
 *
 *   - `options` {Object} is data required to create an app
 *     - `path` {String} is a directory path for the app.
 *   - [`callback`] {Function} is triggered after creating the app.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `error` is trigger on an error.
 *     - `e` {Error} details the error.
 *   - `complete` is trigger when no error occurs.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.path) throw new Error('requires option.path parameter');

    // optional callback
    callback = callback || function() {};

    // expand path
    options.path = path.resolve(options.path);

    // event support
    var emitter = new events.EventEmitter();
    emitter.on('error', callback);
    emitter.on('complete', function() {
        callback(null);
    });

    // create app
    process.nextTick(function() {
        execute(options, emitter);
    });

    return emitter;
};

/*!
 * Execute.
 */

var execute = function(options, emitter) {
    // create local project
    try {
        cordova.create(options.path);
        emitter.emit('complete');
    }
    catch(msg) {
        // cordova does not return Error objects
        var e = (typeof msg === 'string') ? new Error(msg) : msg;
        emitter.emit('error', e);
    }
};
