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

// returns an array of args that are switches ex. --target, -d, --verbose
function getSwitches(args) {
    return args.filter(function(arg) {
       return arg && arg.indexOf("-") === 0;
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

module.exports = {
    // this function takes an args array which is expect to start with the command
    // so if we call `phonegap serve --port 1337` this method would receive `serve --port 1337`
    // ideally we only want to log `serve --port`
    // returns an object with "command" and "params" string properties
    clean:function(args) {
        args = args || [];
        var argsToLog = {"command":"-", "params":"-","count":0};

        if (args.length > 0) {
            argsToLog.command = args[0];
            argsToLog.count = args.length;
            // special case, if 'help,--help,-h` is anywhere, we log it all
            if (indexOfAny(args,["help","--help","-h"]) > -1) {
                argsToLog.params = args.slice(1).join() || "-";
            }
            else {
                switch(args[0].toLowerCase()) {
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
                            argsToLog.params = args.slice(1).join();
                        }
                        break;
                    case "serve"  : // log flags used, but not flag values, fallthru
                    case "app" :
                    case "create" :
                        argsToLog.params = "count:" + (args.length - 1) + " " + getSwitches(args);
                        break;
                    case "cordova" : // log `cordova + command`
                        argsToLog = this.clean(args.slice(1)); // recurse
                        argsToLog.command = "cordova:" + argsToLog.command;
                        break;
                    case "local" : // log `local + command`
                        argsToLog = this.clean(args.slice(1)); // recurse
                        argsToLog.command = "local:" + argsToLog.command;
                        break;
                    case "plugins": // alias fall thru
                    case "plugin" : // add, ls, remove
                        if (indexOfAny(args,["list","ls","remove","rm"]) > -1) {
                            argsToLog.params = args.slice(1).join();
                        }
                        else { // `add`
                            argsToLog.params = "count:" + (args.length - 1) + " " + getSwitches(args);
                        }
                        break;
                    case "push" :
                        argsToLog.params = "count:" + (args.length - 1) + " " + getSwitches(args);
                        break;
                    case "remote" :
                        // login needs special treatment
                        if (args[1].toLowerCase() == "login") {
                            argsToLog.params = "login";
                        }
                        else { // logout, build, install, run <platform>
                            argsToLog.params = args.slice(1).join();
                        }
                        break;
                    case "platforms": // this is an alias, just fall thru
                    case "platform" :
                        // ls, list, rm, remove, check, update
                        if (indexOfAny(args,["list","ls","remove","rm"]) > -1) {
                            argsToLog.params = args.slice(1).join();
                        }
                        else { // add
                            var subCommand = args[1] ? args[1] : "";
                            // todo: only pull out local dir platforms
                            // cordova-platform-id should be fine
                            // git urls (may) be fine ??
                            // ios, android, windows, wp8, ...
                            if (args[2] && ["android","ios","wp8","windows"].indexOf(args[2]) > -1) {
                                subCommand += ":" + args[2];
                            }
                            argsToLog.params = subCommand + " count:" + (args.length - 1) + " " + getSwitches(args);
                        }
                        break;
                    }
            }
        }
        return argsToLog;
    }
};
