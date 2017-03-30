/*
    Module to sanitize args to be sent to analytics, removing
    private user info.
// command hierarchy
    * indicates arg values are stripped and only count, and list of used flags is returned
phonegap
    [help, create*, push*, build, prepare, compile, info, serve*, app*, install, run]
    remote
        [login*, logout, build, install, run]
    plugin
        [ls, list, rm, remove, add*]
    plugins
        [ls, list, rm, remove, add*]
    platform
        [ls, list, rm, remove, add*]
    platforms
        [ls, list, rm, remove, add*]
    template
        [list, search]
    cordova
        [create*, serve*]
        plugin
            [ls, list, rm, remove, add*]
        plugins
            [ls, list, rm, remove, add*]
        platform
            [ls, list, rm, remove, add*]
        platforms
            [ls, list, rm, remove, add*]
*/

// returns an array of args that are switches ex. --target, -d, --verbose, --secret=forbidden
function getSwitches(args) {
    return args.filter(function(arg) { // only switch elems
        return arg && arg.indexOf("-") === 0 && arg != "-v";
    }).map(function(elem) { // remove anything after an '='
        return elem.split("=")[0];
    });
}

// helper, returns the first index into arr1 of the items in arr2
function indexOfAny(arr1,arr2) {
    var index = -1;
    arr2.some(function (elem,pos) {
        if (arr1.indexOf(elem) > -1) {
            index = pos;
            return true;
        }
    });
    return index;
}

// returns an array of args that are NOT switches
function filterSwitches(args) {
    return args.filter(function(arg) {
        return arg && !(arg.indexOf("-") === 0);
    });
}

// Returns an array of filtered parameters that we can log to analytics
// Removes certain tokens, such as particular plugins being added/removed, for privacy reasons
function filterParameters(args) {
    var params = [];
    if (args.length === 0) return params;
    if (indexOfAny(args,["help","--help","-h"]) > -1) {
        params = args.slice(1);
    } else {
        var cmd = args[0].toLowerCase();
        switch(cmd) {
            case "template" : // these choices log ALL args
            case "build"    :
            case "prepare"  :
            case "compile"  :
            case "emulate"  :
            case "install"  :
            case "version"  :
            case "-v"       :
            case "info"     :
            case "run"      :
                // add 'em all if they exist
                if (args.length > 1) {
                    params = args.slice(1);
                }
                break;
            case "serve"  : // for these commands, we do not want to log anything beyond just the command
            case "app" :
            case "create" :
            case "push" :
                break;
            case "cordova" : // log `cordova + command`
            case "local" : // log `local + command`
                // these commands need recursive parsing of parameters - invoke one more time
                params = filterParameters(args.slice(1)); // recurse
                break;
            case "platforms": // this is an alias, just fall thru
            case "platform" :
            case "plugins": // alias fall thru
            case "plugin" :
                // For the list commands, log all arguments.
                if (indexOfAny(args,["list","ls"]) > -1) {
                    params = args.slice(1);
                } else {
                    // for the add+rm command, we dont log _which_ plugins/platforms are
                    // being added/removed.
                    // TODO: perhaps we should log core plugins?
                    params = [args[1]];
                    if (["platform", "platforms"].indexOf(cmd) > -1) {
                        // For platforms add/rm, for certain specific platforms, we log
                        // which platform is being managed.
                        // TODO: only pull out local dir platforms
                        // cordova-platform-id should be fine
                        // git urls (may) be fine ??
                        // ios, android, windows, wp8, ...
                        if (args[2] && ["android","ios","wp8","windows"].indexOf(args[2]) > -1) {
                            params.push(args[2]);
                        }
                    }
                }
                break;
            case "remote" :
                // login needs special treatment
                if (args.length > 2 && args[1].toLowerCase() == "login") {
                    params = ["login"];
                } else { // logout, build, install, run <platform>
                    params = args.slice(1);
                }
                break;
        }
    }
    return filterSwitches(params);
}

// Returns a string representing the command the user ran.
// May return a compound command in the case of "cordova" or "local" commands
function getCommand(args) {
    var cmd = args[0] || "help"; // if no command is passed, assume it is help
    if (cmd.toLowerCase() == "cordova" || cmd.toLowerCase() == "local") {
        cmd += ":" + args[1];
    }
    return cmd;
}

module.exports = {
    getSwitches: getSwitches,
    filterParameters: filterParameters,
    getCommand: getCommand,
    // this function takes an args array which is expect to start with the command
    // so if we call `phonegap serve --port 1337` this method would receive `serve --port 1337`
    // ideally we only want to log `serve --port`
    // returns an object with "command" and "params" string properties
    stringifyForGoogleAnalytics:function(args) {
        args = args || [];
        var argsToLog = {"command":"-", "params":"-","count":0};

        if (args.length > 0) {
            argsToLog.command = getCommand(args);
            argsToLog.count = args.length;
            var filteredParams = filterParameters(args);
            argsToLog.params = filteredParams.join() || "-";
            if (["platform", "platforms"].indexOf(args[0].toLowerCase()) > -1) {
                var subCommand = filteredParams[0] ? filteredParams[0] : "-";
                if (["add", "rm", "remove"].indexOf(subCommand) > -1) {
                    var platform = filteredParams[1];
                    // todo: only pull out local dir platforms
                    // cordova-platform-id should be fine
                    // git urls (may) be fine ??
                    // ios, android, windows, wp8, ...
                    if (platform && ["android","ios","wp8","windows"].indexOf(platform) > -1) {
                        subCommand += ":" + platform;
                    }
                    argsToLog.params = subCommand;
                }
            }
            // Tack on switches at the end, or if there are no parameters, replace with just switches
            var switches = getSwitches(args);
            if (switches.length) {
                if (argsToLog.params == "-") {
                    argsToLog.params = "" + switches;
                } else {
                    argsToLog.params += " " + switches;
                }
            }
        }
        return argsToLog;
    }
};
