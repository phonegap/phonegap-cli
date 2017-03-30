
var sanitizeArgs = require('../../../lib/cli/util/sanitize-args');

describe('sanitize-args', function() {
    it('should exist and export a `stringifyForGoogleAnalytics` function', function() {
        expect(sanitizeArgs).toBeDefined();
        expect(sanitizeArgs.stringifyForGoogleAnalytics).toBeDefined();
    });

    describe('stringifyForGoogleAnalytics', function() {
        it('should not fail with empty args', function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics();
            expect(result).toBeDefined();
        });

        /*
            help --help and -h are treated specially because they can appear anywhere in
            the input, but still have the same effect.
        */

        it('should return all args if either `help`, `--help` or `-h` is found anywhere',function() {
            var cmds = ["help", "--help", "-h"];
            var params = ["a", "b", "c"];
            cmds.forEach(function(cmd) {
                var test_params = params.slice(0);
                test_params.unshift(cmd);
                var result = sanitizeArgs.stringifyForGoogleAnalytics(test_params);
                test_params.forEach(function(param) {
                    if (param == "help") return;
                    expect(result.params).toContain(param);
                });
            });
        });

        /*
            build, prepare, compile, info, template, install
        */
        it('should return all args for basic commands',function() {
            var params = ["a", "b", "c"];
            var commands = ["build", "version", "-v", "prepare", "compile", "info", "template","install","emulate"];
            commands.forEach(function(elem) {
                var result = sanitizeArgs.stringifyForGoogleAnalytics([elem].concat(params));
                expect(result).toBeDefined();
                expect(result.command).toBeDefined();
                expect(result.command).toBe(elem);
                expect(result.params).toBeDefined();
                expect(result.params).toBe(params.join());
            });
        });

        /*
            cordova -v
        */
        it('should handle `cordova -v` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", "-v"]);
            expect(result).toBeDefined();
            expect(result.command).toBe("cordova:-v");
            expect(result.params).toBe("-");
        });

        /*
            create + cordova create
        */
        it('should filter out sensitive info from `create` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["create","--verbose","secretProjectPath","projName", "-d"]);
            expect(result).toBeDefined();
            expect(result.command).toBe("create");
            // sani result is count of args, and what flags are present
            expect(result.params).toBe("--verbose,-d");
        });

        it('should strip `create` calls with args like --key=???',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["create","--key1=secret","--key2=alsosecret"]);
            expect(result).toBeDefined();
            expect(result.command).toBe("create");
            // sani result is count of args, and what flags are present
            expect(result.params).toBe("--key1,--key2");
        });

        it('should filter out sensitive info from `cordova create` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", "create", "--verbose","secretProjectPath","projName", "-d"]);
            expect(result.command).toBe("cordova:create");
            expect(result).toBeDefined();
            expect(result.params).toBe("--verbose,-d");
        });

        /*
            serve, app, cordova serve
        */
        it('should clean out sensitive info from `serve` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["serve","--verbose", "--port", "secretPortNumber","-p","otherSecretPortNumber"]);
            expect(result).toBeDefined();
            expect(result.command).toBe("serve");
            // sani result is count of args, and what flags are present
            expect(result.params).toBe("--verbose,--port,-p");
        });

        it('should clean out sensitive info from `app` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["app","--verbose", "--port", "secretPortNumber","-p","otherSecretPortNumber"]);
            expect(result).toBeDefined();
            expect(result.command).toBe("app");
            // sani result is count of args, and what flags are present
            expect(result.params).toBe("--verbose,--port,-p");
        });

        it('should clean out sensitive info from `cordova serve` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova","serve","8008"]);
            expect(result).toBeDefined();
            expect(result.command).toBe("cordova:serve");
            // sani result is count of args, and what flags are present
            expect(result.params).toBe("-");
        });

        // local
        it('should properly tokenize `phonegap local * *` calls in the resulting command',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["local","platforms", "list","extraJunk"]);
            expect(result).toBeDefined();
            expect(result.command).toBeDefined();
            expect(result.command).toBe("local:platforms");
            expect(result.params).toBe("list,extraJunk");
        });

        /*
            plugin ls, plugin list, cordova plugin ls, cordova plugin list
            plugins ls, plugins list, cordova plugins ls, cordova plugins list
        */
        it('should handle `phonegap plugin list` (and derivates) calls and log extra parameters passed',function() {
            var plugin_cmds = ["plugins", "plugin"];
            var list_cmds = ["ls", "list"];
            plugin_cmds.forEach(function(plug) {
                list_cmds.forEach(function(ls) {
                    var params = [plug, ls, "extraJunk"];
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(params);
                    expect(result).toBeDefined();
                    expect(result.command).toBe(plug);
                    expect(result.params).toBe(ls + ",extraJunk");
                });
            });
        });

        it('should handle `cordova plugin list` (and derivates) calls and log extra parameters passed',function() {
            var plugin_cmds = ["plugins", "plugin"];
            var list_cmds = ["ls", "list"];
            plugin_cmds.forEach(function(plug) {
                list_cmds.forEach(function(ls) {
                    var params = ["cordova", plug, ls, "extraJunk"];
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(params);
                    expect(result).toBeDefined();
                    expect(result.command).toBe("cordova:" + plug);
                    expect(result.params).toBe(ls + ",extraJunk");
                });
            });
        });

        /*
            plugin rm, plugin remove, cordova plugin rm, cordova plugin remove
            plugins rm, plugins remove, cordova plugins rm, cordova plugins remove
        */
        it('should not log what plugins are being removed during `phonegap plugin remove` (and derivates) calls',function() {
            var plugin_cmds = ["plugins", "plugin"];
            var rm_cmds = ["rm", "remove"];
            plugin_cmds.forEach(function(plug) {
                rm_cmds.forEach(function(rm) {
                    var params = [plug, rm, "extraJunk"];
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(params);
                    expect(result).toBeDefined();
                    expect(result.command).toBe(plug);
                    expect(result.params).toBe(rm);
                });
            });
        });

        it('should not log what plugins are being removed during `cordova plugin remove` (and derivates) calls',function() {
            var plugin_cmds = ["plugins", "plugin"];
            var rm_cmds = ["rm", "remove"];
            plugin_cmds.forEach(function(plug) {
                rm_cmds.forEach(function(rm) {
                    var params = ["cordova", plug, rm, "extraJunk"];
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(params);
                    expect(result).toBeDefined();
                    expect(result.command).toBe("cordova:" + plug);
                    expect(result.params).toBe(rm);
                });
            });
        });

        /*
            remote [login*, logout, build, install, run]
        */
        it('should handle `phonegap remote` calls without additional args',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["remote"]);
            expect(result).toBeDefined();
            expect(result.params).toBe("-");
        });

        it('should remove sensitive info from `phonegap remote login` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["remote","login","secret"]);
            expect(result).toBeDefined();
            expect(result.params).toBe("login");
        });

        it('should handle `remote logout` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["remote", "logout","-d"]);
            expect(result).toBeDefined();
            expect(result.params).toBe("logout -d");
        });

        it('should handle `remote build` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["remote", "build","some-platform"]);
            expect(result).toBeDefined();
            expect(result.params).toBe("build,some-platform");
        });

        it('should handle `remote install` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["remote", "install","some-platform"]);
            expect(result).toBeDefined();
            expect(result.params).toBe("install,some-platform");
        });

        it('should handle `remote run` calls',function() {
            var result = sanitizeArgs.stringifyForGoogleAnalytics(["remote", "run","some-platform"]);
            expect(result).toBeDefined();
            expect(result.params).toBe("run,some-platform");
        });

        /*
            platform ls, platform list, cordova platform ls, cordova platform list
            platforms ls, platforms list, cordova platforms ls, cordova platforms list
        */

        it('should handle `phonegap platforms ls` (and derivates) calls',function() {
            var platform_cmds = ["platforms", "platform"];
            var list_cmds = ["ls", "list"];
            platform_cmds.forEach(function(platform) {
                list_cmds.forEach(function(ls) {
                    var result = sanitizeArgs.stringifyForGoogleAnalytics([platform, ls, "extraJunk"]);
                    expect(result).toBeDefined();
                    expect(result.command).toBe(platform);
                    expect(result.params).toBe(ls + ",extraJunk");
                });
            });
        });

        it('should handle `phonegap cordova platforms ls` (and derivates) calls',function() {
            var platform_cmds = ["platforms", "platform"];
            var list_cmds = ["ls", "list"];
            platform_cmds.forEach(function(platform) {
                list_cmds.forEach(function(ls) {
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", platform, ls, "extraJunk"]);
                    expect(result).toBeDefined();
                    expect(result.command).toBe("cordova:" + platform);
                    expect(result.params).toBe(ls + ",extraJunk");
                });
            });
        });

        /*
            platform rm, platform remove, cordova platform rm, cordova platform remove
            platforms rm, platforms remove, cordova platforms rm, cordova platforms remove
        */

        it('should not log non-standard platforms during `phonegap platforms rm` (and derivates) calls',function() {
            var platform_cmds = ["platforms", "platform"];
            var rm_cmds = ["rm", "remove"];
            platform_cmds.forEach(function(platform) {
                rm_cmds.forEach(function(rm) {
                    var result = sanitizeArgs.stringifyForGoogleAnalytics([platform, rm, "extraJunk"]);
                    expect(result).toBeDefined();
                    expect(result.command).toBe(platform);
                    expect(result.params).toBe(rm);
                    expect(result.params).not.toContain("extraJunk");
                });
            });
        });

        it('should not log non-standard platforms during `phonegap cordova platforms rm` (and derivates) calls',function() {
            var platform_cmds = ["platforms", "platform"];
            var rm_cmds = ["rm", "remove"];
            platform_cmds.forEach(function(platform) {
                rm_cmds.forEach(function(rm) {
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", platform, rm, "extraJunk"]);
                    expect(result).toBeDefined();
                    expect(result.command).toBe("cordova:" + platform);
                    expect(result.params).toBe(rm);
                    expect(result.params).not.toContain("extraJunk");
                });
            });
        });

        /*
            platform add, cordova platform add
            platforms add, cordova platforms add
        */
        it('should not log non-standard platforms during `add` (and derivates) calls', function() {
            var platform_cmds = ["platforms", "platform"];
            platform_cmds.forEach(function(platform) {
                var result = sanitizeArgs.stringifyForGoogleAnalytics([platform, "add", "extraJunk"]);
                expect(result).toBeDefined();
                expect(result.command).toBe(platform);
                expect(result.params).toBe("add");
                expect(result.params).not.toContain("extraJunk");
            });
        });
        it('should not log non-standard platforms during `cordova platform add` (and derivates) calls', function() {
            var platform_cmds = ["platforms", "platform"];
            platform_cmds.forEach(function(platform) {
                var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", platform, "add", "extraJunk"]);
                expect(result).toBeDefined();
                expect(result.command).toBe("cordova:" + platform);
                expect(result.params).toBe("add");
                expect(result.params).not.toContain("extraJunk");
            });
        });
        it('should log standard platforms during `add` (and derivates) calls', function() {
            var platform_cmds = ["platforms", "platform"];
            var standard_platforms = ["android", "ios", "wp8", "windows"];
            platform_cmds.forEach(function(cmd) {
                standard_platforms.forEach(function(platform) {
                    var result = sanitizeArgs.stringifyForGoogleAnalytics([cmd, "add", platform]);
                    expect(result).toBeDefined();
                    expect(result.command).toBe(cmd);
                    expect(result.params).toContain("add");
                    expect(result.params).toContain(platform);
                });
            });
        });
        it('should log standard platforms during `cordova platform add` calls', function() {
            var platform_cmds = ["platforms", "platform"];
            var standard_platforms = ["android", "ios", "wp8", "windows"];
            platform_cmds.forEach(function(cmd) {
                standard_platforms.forEach(function(platform) {
                    var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", cmd, "add", platform]);
                    expect(result).toBeDefined();
                    expect(result.command).toBe("cordova:" + cmd);
                    expect(result.params).toContain("add");
                    expect(result.params).toContain(platform);
                });
            });
        });
        /*
            plugin add, cordova plugin add
            plugins add, cordova plugins add
        */
        it('should not log particular plugins during `add` calls', function() {
            var plugin_cmds = ["plugins", "plugin"];
            plugin_cmds.forEach(function(plugin) {
                var result = sanitizeArgs.stringifyForGoogleAnalytics([plugin, "add", "extraJunk"]);
                expect(result).toBeDefined();
                expect(result.command).toBe(plugin);
                expect(result.params).toBe("add");
                expect(result.params).not.toContain("extraJunk");
            });
        });
        it('should not log particular plugins during `cordova plugin add` calls', function() {
            var plugin_cmds = ["plugins", "plugin"];
            plugin_cmds.forEach(function(plugin) {
                var result = sanitizeArgs.stringifyForGoogleAnalytics(["cordova", plugin, "add", "extraJunk"]);
                expect(result).toBeDefined();
                expect(result.command).toBe("cordova:" + plugin);
                expect(result.params).toBe("add");
                expect(result.params).not.toContain("extraJunk");
            });
        });
    });
    describe('getCommand', function() {
        it('should be able to handle zero arguments', function() {
            var get_cmd = function() {
                sanitizeArgs.getCommand([]);
            };
            expect(get_cmd).not.toThrow();
        });
        it('should return "help" by default if no arguments are given', function() {
            expect(sanitizeArgs.getCommand([])).toEqual('help');
        });
    });
    describe('filterParameters', function() {
        it('should be able to handle zero arguments', function() {
            var filter_cmd = function() {
                sanitizeArgs.filterParameters([]);
            };
            expect(filter_cmd).not.toThrow();
        });
        it('should return an empty array by default if no arguments are given', function() {
            expect(sanitizeArgs.filterParameters([])).toEqual([]);
        });
    });
});
