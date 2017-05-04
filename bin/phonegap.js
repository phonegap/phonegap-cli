#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli');
var cli = new CLI();
var analytics = cli.analytics;
// start timer as soon as this module is loaded
var startTime = Date.now();

process.on('uncaughtException', function(err) {
    console.error('There was an unhandled exception within phonegap-cli! If you would like to help the PhoneGap project, please file the following details over at https://github.com/phonegap/phonegap-cli/issues');
    console.error(err.stack);
    var args = Array.prototype.slice.call(process.argv).slice(2);
    // Track event using standard analytics lib, but provide third argument
    // that are 'overrides' so that we can force the event name to be a "crash"
    // and force tracking of original parameters.
    var dTms = Date.now() - startTime;
    analytics.trackEvent(args, err, {
        short_message: "crash",
        _params: args,
        _duration: dTms
    });
    process.exit(1);
});

if (analytics.statusUnknown()) {
    // if it is an analytics command, just run it
    if (process.argv.length > 2 && process.argv[2] === 'analytics') {
        runPhoneGapCommand();
    }
    else {
        // otherwise prompt and then run it
        analytics.prompt(runPhoneGapCommand);
    }
}
else {
    runPhoneGapCommand();
}

/*!
 * Run the command-line client.
 */
function runPhoneGapCommand() {
    // pass it into normal flow
    cli.argv(process.argv, function(e) {
        var args = Array.prototype.slice.call(process.argv);
        // analytics module will skip if it is not enabled
        var dTms = Date.now() - startTime;
        // slice off the first two, as that contains node [0] and phonegap.js [1]
        analytics.trackEvent(args.slice(2), e, {_duration:dTms});
        process.exitCode = e ? e.exitCode || 1 : 0;
    });
}
