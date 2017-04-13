#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli');
var cli = new CLI();
var analytics = cli.analytics;

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
        analytics.trackEvent(args.slice(2), e); // slice off the first two, as that contains node [0] and phonegap.js [1]
        process.exitCode = e ? e.exitCode || 1 : 0;
    });
}
