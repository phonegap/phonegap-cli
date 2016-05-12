#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli');
var cli = new CLI();
var tracking = cli.tracking;
var version = require('../package.json').version;

if(tracking.statusUnknown()) {
    tracking.prompt(function(){
        // special case, if it is a 'phonegap tracking' command we don't want
        // to run it because the prompt will have already done the work
        if(process.argv[2] != "tracking"){
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

    cli.argv(process.argv, function(e) {

        // tracking module will skip if it is not enabled

        tracking.trackEvent("pg-cli " + version,
                            process.argv[2],
                            process.argv[3],
                            e ? e.exitCode || 1 : 0 );

        // if we receive an error, then exit with an error status
        // if an exit code was attached to the error, then use it
        // otherwise default to 1.
        if (e) {
            process.exit(e.exitCode || 1);
        }
    });
}
