/*
    Module to sanitize args to be sent to analytics, removing
    private user info.




phonegap +
    help [command]          // log EVERYTHING in a help command, this is crucial to seeing where users have issues
    create <path>           // log the number of args passed to create, and whether if template was used. log flags used, but not values
    build <platforms>       // debug or release flags? browserify? how many platforms at once?
    install <platforms>     // phonegap local install android --device|--emulator|-e
    run <platforms>
    platform [command]
    plugin [command]
    template
        list                // log it all
        search              // log it all
    info
    serve
    version || -v
    push
    tracking


    local [command] // deprecated, just calls: pg local a b c -> pg a b c
    remote [command]
        login -> prompts for actual info
        logout
        build <platform>
        install <platform>
        run <platform>

    prepare <platforms>
    compile <platforms>
    emulate <platforms>
    cordova



Things to remove:
--target <id> Always remove ID

*/

// returns an array of args that are switches ex. --target, -d, --verbose
function getSwitches(args) {
    return args.filter(function(arg){
       return arg && arg.indexOf("-") == 0;
    });
}

module.exports = {
    // this function takes an args array which is expect to start with the command
    // so if we call `phonegap serve --port 1337` this method would receive `serve --port 1337`
    // ideally we only want to log `serve --port`
    clean:function(args) {
        console.log('args = ' + args);
        args = args || [];
        var argsToLog = {"command":"", "params" :""};

        if(args.length > 0) {
            argsToLog.command = args[0];
            switch(args[0].toLowerCase()) {
                case "template" : // these choices log ALL args
                case "help"     :
                case "serve"    :
                case "build"    :
                case "prepare"  :
                case "compile"  :
                case "info"     :
                    // add 'em all if they exist
                    if(args.length > 1) {
                        argsToLog.params = args.slice(1).join();
                    }
                    break;
                case "create" : // these choices log ONLY the first command
                    argsToLog.params = "count:" + (args.length - 1) + " " + getSwitches(args);
                    break;
                case "cordova" : // log `cordova + command`
                    argsToLog = this.clean(args.slice(1));
                    argsToLog.command = "cordova:" + argsToLog.command;
                    break;
                case "plugin" : // add, ls, remove
                    if(args.indexOf("ls") > -1) {
                        argsToLog.params = args.slice(1).join();
                    }
                    else {
                        argsToLog.params = "count:" + (args.length - 1) + " " + getSwitches(args);
                    }
                    break;
                case "platform" : // add, ls, remove
                    if(args.indexOf("ls") > -1) {
                        argsToLog.params = args.slice(1).join();
                    }
                    else {
                        argsToLog.params = "count:" + (args.length - 1) + " " + getSwitches(args);
                    }
                    break;
            }
        }
        return argsToLog;
    }
}