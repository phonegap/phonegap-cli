var os_name = require('os-name');

var CLI=require('./lib/cli');
var cli = new CLI();
var flags = cli.argv.FLAGS;

var regular_commands = [];
for (var m in cli) {
    if (typeof cli[m] == 'function') {
        regular_commands.push(m);
    }
}

// Special cases based on ./lib/cli/argv.js
// 1. if version flag is passed in, print version, exit.
// 2. verbose flag sets a mode globally, in all cases.
// TODO: 3 + 4 can stack together to fail.
// 3. if -h or --help, set command to help.
// 4. if final token is "help", set command to help.
// 5. no command, set command to help.
// 6. if command is a regular command, run it and exit.
// 7. all other kinds of input, toss over the wall to cordova.
//
// notes about analytics in GA:
// - label contains exit code.
// = value contains number of parameters.
// - category contains top-level regular command - even if it is invalid (such as "CallCabUser" or "buld" - actual values in GA)
// - action contains sanitized parameters, which does the following sanitization:
//   - a bunch of top-level commands will log all parameters
//     - `plugin add` will not log the plugin to be added, but remove will, interestingly.
//   - a smaller set will only log flags w/ `-` at the start
//   - `cordova` will log itself as `cordova:<sub-cordova-command>` and recurse on its parameters
//   - `local` does the same as `cordova`
//   - TODO: more.
// - tracks user using configstore npm module, which persists a JSON file into user's home directory.
// - track session. insight, the GA module phonegap-cli uses, doesnt change this, so it looks to be default GA session length: https://support.google.com/analytics/answer/2731565?hl=en
//   - that is, 30 mins of inactivity or midnight rolls around will expire a user's session.
// - tracks node, os and app version via insight
// - tracks geo
//
// notes about new analytics tracking
// - tracking exit code makes sense - we can identify commands that return non-zero exit codes (and presumably fail) the most.
// - tracking parameter count probalby not very useful, maybe?
// - we could probably track stack traces via error objects, if we wanted to.
// - main insights gathered today are command, parameters, and exit code - need to maintain this as a baseline.
// - we can track using the same approach as the current GA approach uses: using the configstore module with the same UIDs.
// - session id? how does it work in GA?
// - node, os and app versions are tracked
// - tracks geo automatically - dont have to worry about it
//
// so a new analytics event JSON would maybe look like:

var example_event = {
    "version": "1.1",
    "host": "cli",
    "short_message": "top-level command: help, create, plugin. OR, could group by functionality together here, i.e. help, create, plugin ls, plugin rm, plugin add, etc.",
    "_userID": "something representing a unique user. how?",
    "_appVersion": require('./package.json').version,
    "_nodeVersion": process.version,
    "_platform": os_name(),
    "_env": 1
};

console.log('Regular commands:', regular_commands);
console.log('All CLI flags:', flags);
console.log('Example event:', example_event);
