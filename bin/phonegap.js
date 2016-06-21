#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli');
var cli = new CLI();
var analytics = cli.analytics;
var version = require('../package.json').version;
var sanitizeArgs = require('../lib/cli/util/sanitize-args');

if (analytics.statusUnknown()) {
    analytics.prompt(function() {
        // special case, if it is a 'phonegap analytics' command we don't want
        // to run it because the prompt will have already done the work
        if (process.argv[2] !== 'analytics') {
            runPhoneGapCommand();
        }
    });
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
        // if we received an error, then we will exit with an error status
        // if an exit code was attached to the error, then use it
        // otherwise default to 1.
        var exitCode = e ? e.exitCode || 1 : 0;
        var args = Array.prototype.slice.call(process.argv);
        var cleanedResult = sanitizeArgs.clean(args.slice(2));
        // analytics module will skip if it is not enabled
        analytics.trackEvent(cleanedResult.command,
                             cleanedResult.params,
                             exitCode + "",
                            cleanedResult.count);
        process.exitCode = exitCode;
    });
}
