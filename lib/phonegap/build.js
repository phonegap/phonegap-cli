/*!
 * Module dependencies.
 */

var cordova = require('cordova'),
    events = require('events');

/**
 * Build an App.
 *
 * Automatically detects whether to build application on the local system
 * or remotely with PhoneGap/Build.
 *
 * Options:
 *
 *   - `options` {Object}
 *     - `platforms` {Array} is a list of platforms (limited to 1).
 *   - [`callback`] {Function} is triggered after completion.
 *     - `e` {Error} is null unless there is an error.
 *
 * Events:
 *
 *   - `log` is fired with progress information.
 *   - `warn` is fired with warning information.
 *   - `error` is fired on an error.
 *     - `e` {Error} details the error.
 *   - `complete` is fired on successful completion.
 */

module.exports = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
    if (!options.platforms) throw new Error('requires option.platforms parameter');

    // optional callback
    callback = callback || function(e) {};

    // event support
    var emitter = new events.EventEmitter();
    emitter.on('error', callback);
    emitter.on('complete', function() {
        callback(null);
    });

    // augment options
    options.self = this;

    // build app
    process.nextTick(function() {
        execute(options, emitter);
    });

    return emitter;
};

/*!
 * Execute.
 */

var execute = function(options, emitter) {
    var self = this,
        platform = options.platforms[0];

    // detect the platform support
    cordova.platform.supports(platform, function(supported) {
        // invoke local or remote build
        var env = (supported) ? 'local' : 'remote',
            build = options.self[env].build(options);

        // map the events to this emitter
        //build.on('log', function() {
        //    var args = Array.prototype.slice.call(arguments);
        //    args.unshift('log');
        //    emitter.emit.apply(self, args);
        //});
        //build.on('warn', function() {
        //    var args = Array.prototype.slice.call(arguments);
        //    args.unshift('warn');
        //    emitter.emit.apply(this, args);
        //});
        //build.on('error', function() {
        //    var args = Array.prototype.slice.call(arguments);
        //    args.unshift('error');
        //    emitter.emit.apply(this, args);
        //});
        //build.on('complete', function() {
        //    var args = Array.prototype.slice.call(arguments);
        //    args.unshift('complete');
        //    emitter.emit.apply(this, args);
        //});
    });
};
