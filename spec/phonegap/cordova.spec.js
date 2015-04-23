/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    events = require('events'),
    cordova = require('../../lib/cordova'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    phonegap,
    processSpy,
    options;

/*!
 * Specification: phonegap.cordova(options, [callback])
 */

describe('phonegap.cordova(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            cmd: 'cordova build ios'
        };
        spyOn(cordova.util, 'listPlatforms').andReturn(['ios']);
        processSpy = {
            stdout: new events.EventEmitter(),
            stderr: new events.EventEmitter()
        };
        spyOn(shell, 'exec').andReturn(processSpy);
        // disable adding phonegap.js
        spyOn(cordova.util, 'isCordova').andReturn('/some/path');
        spyOn(fs, 'existsSync').andReturn(false);
        spyOn(shell, 'cp');
        // disable phonegap.js deprecation warning
        spyOn(shell, 'grep').andReturn('');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.cordova(options, function(e) {});
        }).toThrow();
    });

    it('should require options.cmd', function() {
        expect(function() {
            options.cmd = undefined;
            phonegap.cordova(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.cordova(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.cordova(options)).toEqual(phonegap);
    });

    it('should try to execute the cordova command', function() {
        phonegap.cordova(options);
        expect(shell.exec).toHaveBeenCalled();
        expect(shell.exec.mostRecentCall.args[0]).toMatch(options.cmd);
    });

    describe('executing a cordova command', function() {
        beforeEach(function() {
            options.verbose = true;
        });

        it('should support spaces in path to cordova executable', function() {
            var fakeResolvedPath = 'C:\\Users\\User Name\\AppData\\Roaming\\npm',
                _join = path.join;
            // resolve returns a fake Windows OS styled path with a space
            spyOn(path, 'resolve').andReturn(fakeResolvedPath);
            // spy on join and only modify the faked path, allowing the rest to call the normal join
            // this is required to allow the test to run on both Windows and Unix, since both use
            // different delimiting slashes.
            spyOn(path, 'join').andCallFake(function(p1, p2) {
                if (p1 === fakeResolvedPath)
                    return fakeResolvedPath + '\\' + p2;
                else
                    return _join.apply(path, arguments);
            });

            phonegap.cordova(options);
            expect(shell.exec.mostRecentCall.args[0]).toEqual('"C:\\Users\\User Name\\AppData\\Roaming\\npm\\cordova" build ios');
        });

        it('should output stdout data', function(done) {
            phonegap.on('raw', function(data) {
                expect(data).toEqual('hello stdout');
                done();
            });
            phonegap.cordova(options);
            processSpy.stdout.emit('data', 'hello stdout');
        });

        it('should output stderr data', function(done) {
            phonegap.on('raw', function(data) {
                expect(data).toEqual('hello stderr');
                done();
            });
            phonegap.cordova(options);
            processSpy.stderr.emit('data', 'hello stderr');
        });

        describe('successful', function(done) {
            beforeEach(function() {
                shell.exec.andCallFake(function(cmd, options, callback) {
                    process.nextTick(function() {
                        callback(0, ''); // exit code 0, '' output
                    });
                    return processSpy;
                });
            });

            it('should trigger the callback without an error', function(done) {
                phonegap.cordova(options, function(e) {
                    expect(e).toBeUndefined();
                    done();
                });
            });
        });

        describe('failure', function(done) {
            beforeEach(function() {
                shell.exec.andCallFake(function(cmd, options, callback) {
                    process.nextTick(function() {
                        callback(1, 'bad error');
                    });
                    return processSpy;
                });
            });

            it('should trigger the callback without an error', function(done) {
                phonegap.cordova(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    expect(e.exitCode).toEqual(1);
                    done();
                });
            });
        });

        describe('when not a valid cordova project', function() {
            beforeEach(function() {
                cordova.util.isCordova.andReturn(false);
                shell.exec.andCallThrough();
            });

            it('should trigger the callback without an error', function(done) {
                phonegap.cordova(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('adding plugin paths', function() {
        it('should not alter the plugin path', function() {
            options.cmd = 'cordova plugin add http://path/to/cordova-plugin.git';
            phonegap.cordova(options);
            expect(shell.exec).toHaveBeenCalled();
            expect(shell.exec.mostRecentCall.args[0]).toMatch(options.cmd);
        });
    });

    describe('add platforms', function() {
        describe('when the command is of the type:', function() {
            beforeEach(function() {
                cordova.util.listPlatforms.andReturn([]);
            });

            it('cordova prepare <platform>', function() {
                options.cmd = 'cordova prepare ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios');
            });

            it('cordova compile <platform>', function() {
                options.cmd = 'cordova compile ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios');
            });

            it('cordova build <platform>', function() {
                options.cmd = 'cordova build ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios');
            });

            it('cordova run <platform>', function() {
                options.cmd = 'cordova run ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios');
            });

            it('cordova emulate <platform>', function() {
                options.cmd = 'cordova emulate ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios');
            });

            it('not cordova prepare', function() {
                options.cmd = 'cordova prepare';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
            });

            it('not cordova compile', function() {
                options.cmd = 'cordova compile';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
            });

            it('not cordova build', function() {
                options.cmd = 'cordova build';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
            });

            it('not cordova run', function() {
                options.cmd = 'cordova run';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
            });

            it('not cordova emulate', function() {
                options.cmd = 'cordova emulate';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
            });

            it('not cordova create <path>', function() {
                options.cmd = 'cordova create my-app';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add');
            });
        });

        describe('when no platform is specified', function() {
            beforeEach(function() {
                options.cmd = 'cordova run';
            });

            it('should not add a platform', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save');
            });

            it('should ignore an option and not add a platform', function() {
                options.cmd = 'cordova run --emulator';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save');
            });
            it('should ignore options and not add a platform', function() {
                options.cmd = 'cordova run --emulator --target="Sim"';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save');
            });
        });

        describe('when a platform does not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios';
                cordova.util.listPlatforms.andReturn([]);
            });

            it('should try to add the platform', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios');
            });
        });

        describe('when multiple platforms do not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios android';
                cordova.util.listPlatforms.andReturn([]);
            });

            it('should try to add all of the platforms', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios android');
            });
        });

        describe('when some platforms do not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios android wp8';
                cordova.util.listPlatforms.andReturn(['android']);
            });

            it('should try to add the missing platforms', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add --save ios wp8');
            });
        });

        describe('after adding the platform(s)', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios';
                cordova.util.listPlatforms.andReturn([]);
                shell.exec.andCallFake(function(cmd, options, callback) {
                    process.nextTick(function() {
                        callback(0, '');
                    });
                    return processSpy;
                });
            });

            it('should execute the original command', function(done) {
                phonegap.cordova(options, function(e) {
                    expect(shell.exec.calls[0].args[0]).toMatch('platform add --save ios');
                    expect(shell.exec.calls[1].args[0]).toMatch('cordova build ios');
                    done();
                });
            });
        });
    });

    describe('adding phonegap.js backwards compatibility', function() {
        beforeEach(function() {
            // phonegap.js reference found
            shell.grep.andReturn('<script src="phonegap.js"></script>');
            // enable injecting phonegap.js
            fs.existsSync.andCallFake(function(filepath) {
                // return true if checking cordova.js path
                return (filepath.match('cordova.js'));
            });
        });

        it('should add phonegap.js for ios', function() {
            phonegap.cordova(options);
            expect(shell.cp).toHaveBeenCalled();
            expect(shell.cp.mostRecentCall.args[1]).toMatch(/ios.*cordova\.js/);
            expect(shell.cp.mostRecentCall.args[2]).toMatch(/ios.*phonegap\.js/);
        });

        it('should add phonegap.js for ios and android', function() {
            options.cmd = 'cordova build ios android';
            cordova.util.listPlatforms.andReturn(['ios', 'android']);
            phonegap.cordova(options);
            expect(shell.cp).toHaveBeenCalled();
            expect(shell.cp.calls.length).toEqual(2);
            expect(shell.cp.calls[0].args[1]).toMatch(/ios.*cordova\.js/);
            expect(shell.cp.calls[0].args[2]).toMatch(/ios.*phonegap\.js/);
            expect(shell.cp.calls[1].args[1]).toMatch(/android.*cordova\.js/);
            expect(shell.cp.calls[1].args[2]).toMatch(/android.*phonegap\.js/);
        });
    });

    describe('adding phonegap.js deprecation warning', function() {
        describe('when app does not reference phonegap.js', function() {
            beforeEach(function() {
                // no phonegap.js reference found
                shell.grep.andReturn('');
            });

            it('should not emit a deprecation warning', function(done) {
                phonegap.on('warn', function(message) {
                    expect(false).toBe(true);
                    done();
                });
                phonegap.cordova(options);
                process.nextTick(function() {
                    done(); // given time for warn event to be emitted
                });
            });
        });

        describe('when app references phonegap.js', function() {
            beforeEach(function() {
                // phonegap.js reference found
                shell.grep.andReturn('<script src="phonegap.js"></script>');
            });

            it('should not emit a deprecation warning', function(done) {
                phonegap.on('warn', function(message) {
                    expect(message).toMatch(/phonegap\.js/i);
                    done();
                });
                phonegap.cordova(options);
            });
        });
    });
});
