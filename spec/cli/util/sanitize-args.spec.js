
var sanitizeArgs = require('../../../lib/cli/util/sanitize-args');

describe('sanitize-args', function() {

    it('should exist and export a `clean` function', function(done) {
        expect(sanitizeArgs).toBeDefined();
        expect(sanitizeArgs.clean).toBeDefined();
        done();
    });

    it('should not fail with empty args', function(done) {
        var result = sanitizeArgs.clean();
        expect(result).toBeDefined();
        done();
    });

    /*
        help --help and -h are treated specially because they can appear anywhere in
        the input, but still have the same effect.
    */

    it('should return all args if `help` is found anywhere',function(done) {
        var params = ["help","a", "b", "c"];
        for(var n = 0; n < 3; n++) {
            var result = sanitizeArgs.clean(params);
            expect(result.params).toBe(params.slice(1).join());
            params.push(params.shift());
        }
        done();
    });

    it('should return all args if `--help` is found anywhere',function(done) {
        var params = ["--help","a", "b", "c"];
        for(var n = 0; n < 3; n++) {
            var result = sanitizeArgs.clean(params);
            expect(result.params).toBe(params.slice(1).join());
            params.push(params.shift());
        }
        done();
    });

    it('should return all args if `-h` is found anywhere',function(done) {
        var params = ["-h","a", "b", "c"];
        for(var n = 0; n < 3; n++) {
            var result = sanitizeArgs.clean(params);
            expect(result.params).toBe(params.slice(1).join());
            params.push(params.shift());
        }
        done();
    });

    /*
        build, prepare, compile, info, template, install
    */
    it('should return all args for basic commands',function(done) {
        var params = ["a", "b", "c"];
        var commands = ["build", "version", "-v", "prepare", "compile", "info", "template","install","emulate"];
        commands.forEach(function(elem) {
            var result = sanitizeArgs.clean([elem].concat(params));
            expect(result).toBeDefined();
            expect(result.command).toBeDefined();
            expect(result.command).toBe(elem);
            expect(result.params).toBeDefined();
            expect(result.params).toBe(params.join());
        });
        done();
    });

    /*
        cordova -v
    */
    it('should handle `cordova -v` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "-v"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:-v");
        expect(result.params).toBe("-");
        done();
    });

    /*
        create + cordova create
    */
    it('should clean `create` calls',function(done) {
        var result = sanitizeArgs.clean(["create","--verbose","secretProjectPath","projName", "-d"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("create");
        // sani result is count of args, and what flags are present
        expect(result.params).toBe("count:4 --verbose,-d");
        done();
    });

    it('should handle `cordova create` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "create", "--verbose","secretProjectPath","projName", "-d"]);
        expect(result.command).toBe("cordova:create");
        expect(result).toBeDefined();
        expect(result.params).toBe("count:4 --verbose,-d");
        done();
    });

    /*
        serve, app, cordova serve
    */
    it('should clean `serve` calls',function(done) {
        var result = sanitizeArgs.clean(["serve","--verbose", "--port", "secretPortNumber","-p","otherSecretPortNumber"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("serve");
        // sani result is count of args, and what flags are present
        expect(result.params).toBe("count:5 --verbose,--port,-p");
        done();
    });

    it('should clean `app` calls',function(done) {
        var result = sanitizeArgs.clean(["app","--verbose", "--port", "secretPortNumber","-p","otherSecretPortNumber"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("app");
        // sani result is count of args, and what flags are present
        expect(result.params).toBe("count:5 --verbose,--port,-p");
        done();
    });

    it('should clean `cordova serve` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","serve","8008"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:serve");
        // sani result is count of args, and what flags are present
        expect(result.params).toBe("count:1 ");
        done();
    });

    // local
    it('should handle `phonegap local * *` calls',function(done) {
        var result = sanitizeArgs.clean(["local","platforms", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("local:platforms");
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    /*
        plugin ls, plugin list, cordova plugin ls, cordova plugin list
        plugins ls, plugins list, cordova plugins ls, cordova plugins list
    */
    it('should handle `phonegap plugin list` calls',function(done) {
        var result = sanitizeArgs.clean(["plugin", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `phonegap plugin ls` calls',function(done) {
        var result = sanitizeArgs.clean(["plugin", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `phonegap plugins list` calls',function(done) {
        var result = sanitizeArgs.clean(["plugins", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `phonegap plugins ls` calls',function(done) {
        var result = sanitizeArgs.clean(["plugins", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `cordova plugin list` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugin", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugin");
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `cordova plugin ls` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugin", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugin");
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `cordova plugins list` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugins", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugins");
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `cordova plugins ls` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugins", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugins");
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    /*
        plugin rm, plugin remove, cordova plugin rm, cordova plugin remove
        plugins rm, plugins remove, cordova plugins rm, cordova plugins remove
    */
    it('should handle `phonegap plugin remove` calls',function(done) {
        var result = sanitizeArgs.clean(["plugin", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `phonegap plugin rm` calls',function(done) {
        var result = sanitizeArgs.clean(["plugin", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `phonegap plugins remove` calls',function(done) {
        var result = sanitizeArgs.clean(["plugins", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `phonegap plugins rm` calls',function(done) {
        var result = sanitizeArgs.clean(["plugins", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `cordova plugin remove` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugin", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugin");
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `cordova plugin rm` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugin", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugin");
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `cordova plugins remove` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugins", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugins");
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `cordova plugins rm` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "plugins", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBe("cordova:plugins");
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    /*
        remote [login*, logout, build, install, run]
    */
    it('should clean `phonegap remote login` calls',function(done) {
        var result = sanitizeArgs.clean(["remote","login","secret"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("login");
        done();
    });

    it('should handle `remote logout` calls',function(done) {
        var result = sanitizeArgs.clean(["remote", "logout","-d"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("logout,-d");
        done();
    });

    it('should handle `remote build` calls',function(done) {
        var result = sanitizeArgs.clean(["remote", "build","some-platform"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("build,some-platform");
        done();
    });

    it('should handle `remote install` calls',function(done) {
        var result = sanitizeArgs.clean(["remote", "install","some-platform"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("install,some-platform");
        done();
    });

    it('should handle `remote run` calls',function(done) {
        var result = sanitizeArgs.clean(["remote", "run","some-platform"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("run,some-platform");
        done();
    });

    /*
        platform ls, platform list, cordova platform ls, cordova platform list
        platforms ls, platforms list, cordova platforms ls, cordova platforms list
    */

    it('should handle `phonegap platformS ls` calls',function(done) {
        var result = sanitizeArgs.clean(["platforms", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `phonegap platformS list` calls',function(done) {
        var result = sanitizeArgs.clean(["platforms", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platforms ls` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platforms", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platforms");
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platforms list` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platforms", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platforms");
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `phonegap platform ls` calls',function(done) {
        var result = sanitizeArgs.clean(["platform", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `phonegap platform list` calls',function(done) {
        var result = sanitizeArgs.clean(["platform", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platform ls` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platform", "ls","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platform");
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platform list` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platform", "list","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platform");
        expect(result.params).toBe("list,extraJunk");
        done();
    });

    /*
        platform rm, platform remove, cordova platform rm, cordova platform remove
        platforms rm, platforms remove, cordova platforms rm, cordova platforms remove
    */

    it('should handle `phonegap platformS rm` calls',function(done) {
        var result = sanitizeArgs.clean(["platforms", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `phonegap platformS remove` calls',function(done) {
        var result = sanitizeArgs.clean(["platforms", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platforms rm` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platforms", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platforms");
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platforms remove` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platforms", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platforms");
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `phonegap platform rm` calls',function(done) {
        var result = sanitizeArgs.clean(["platform", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `phonegap platform remove` calls',function(done) {
        var result = sanitizeArgs.clean(["platform", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platform rm` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platform", "rm","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platform");
        expect(result.params).toBe("rm,extraJunk");
        done();
    });

    it('should handle `phonegap cordova platform remove` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova","platform", "remove","extraJunk"]);
        expect(result).toBeDefined();
        expect(result.command).toBeDefined();
        expect(result.command).toBe("cordova:platform");
        expect(result.params).toBe("remove,extraJunk");
        done();
    });

});
