/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    events = require('events'),
    cordova = require('../../lib/cordova'),
    cordovaDependency = require('phonegap-cordova-dependence'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    phonegap,
    processSpy,
    utilSpy,
    options,
    cordovaDependencySpy
    TIMEOUT = 10000;

/*!
 * Specification: phonegap.cordova(options, [callback])
 */

describe('phonegap.cordova(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            cmd: 'cordova build ios'
        };
        utilSpy = {
            listPlatforms : function(){
                return ['ios']
            },
            isCordova : function(){
                return '/some/path'
            }
        };
        spyOn(cordovaDependency, 'exec').andCallFake(function(){
            return Q('');
        });
        spyOn(cordova.util, 'listPlatforms').andCallFake(utilSpy.listPlatforms);
        spyOn(cordova.util, 'isCordova').andCallFake(utilSpy.isCordova);
        processSpy = {
            stdout: new events.EventEmitter(),
            stderr: new events.EventEmitter()
        };
        spyOn(shell, 'exec').andCallFake(function(command, options, callback) {
            callback(0, '');
            return processSpy;
        });
        // disable adding phonegap.js
        spyOn(fs, 'existsSync').andCallFake(function(){
            return true;
        });
        spyOn(shell, 'cp');
        // disable phonegap.js deprecation warning
        spyOn(shell, 'grep').andReturn('');
    });

    afterEach(function(){
        this.removeAllSpies();
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

    it('should try to execute the cordova command', function(done) {
        phonegap.cordova(options, function(err){
            expect(err).toBeUndefined();
            expect(shell.exec).toHaveBeenCalled();
            expect(shell.exec.mostRecentCall.args[0]).toMatch(options.cmd);
            done();
        });
    }, TIMEOUT);

    describe('executing a cordova command', function() {
        beforeEach(function() {
            options.verbose = true;
        });

        it('should support spaces in path to cordova executable', function(done) {
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
            phonegap.cordova(options, function(err){
                expect(err).toBeUndefined();
                expect(shell.exec).toHaveBeenCalled();
                expect(shell.exec.mostRecentCall.args[0]).toEqual('"C:\\Users\\User Name\\AppData\\Roaming\\npm\\cordova" build ios');
                done();
            });
        }, TIMEOUT);

        it('should output stdout data', function(done) {
            var pass = false;
            var rawSpy = createSpy('raw output').andCallFake(function(data){
                pass = (data == 'hello stdout') || data;
            });
            phonegap.on('log', rawSpy);
            phonegap.cordova(options, function(err){
                expect(err).toBeUndefined();
            });
            process.nextTick(function(){
                processSpy.stdout.emit('data', 'hello stdout');
                expect(rawSpy).toHaveBeenCalled();
                expect(pass).toBe(true);
                done();
            });
        }, TIMEOUT);
        
        it('should output stderr data', function(done) {
            var rawSpy = createSpy('raw output').andCallFake(function(data){
                expect(data).toEqual('hello stderr');  
            })
            phonegap.on('error', rawSpy);
            phonegap.cordova(options);
            process.nextTick(function(){
                processSpy.stderr.emit('data', 'hello stderr');
                expect(rawSpy).toHaveBeenCalled();
                done();
            });
        }, TIMEOUT);

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

            it('should trigger the callback with an error', function(done) {
                phonegap.cordova(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    expect(e.exitCode).toEqual(1);
                    done();
                });
            }, TIMEOUT);
        });

        describe('when not a valid cordova project', function() {
            beforeEach(function() {
                cordova.util.isCordova.andReturn(false);
                shell.exec.andCallThrough();
                console.log(options);
            });
            // ToDo: @carynbear this not testable with current dependency implementation b/c no cordova to call without project.
            // expects failure when calling cordova build ios on a non-project
            xit('should trigger the callback with an error', function(done) {
                phonegap.cordova(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            }, TIMEOUT);
        });
    });

    describe('adding plugin paths', function() {
        it('should not alter the plugin path', function(done) {
            options.cmd = 'cordova plugin add http://path/to/cordova-plugin.git';
            phonegap.cordova(options, function(e){
                expect(shell.exec).toHaveBeenCalled();
                expect(shell.exec.mostRecentCall.args[0]).toMatch(options.cmd);
                done();
            });
        });
    });

    describe('add platforms', function() {
        describe('when the command is of the type:', function() {
            beforeEach(function() {
                cordova.util.listPlatforms.andReturn([]);
            });

            it('cordova prepare <platform>', function(done) {
                options.cmd = 'cordova prepare ios';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios');
                    expect(shell.exec.argsForCall[1][0]).toMatch('prepare ios');
                    done();
                });
                
            });

            it('cordova compile <platform>', function(done) {
                options.cmd = 'cordova compile ios';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios');
                    expect(shell.exec.argsForCall[1][0]).toMatch('compile ios');
                    done();
                });
            });

            it('cordova build <platform>', function(done) {
                options.cmd = 'cordova build ios';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios');
                    expect(shell.exec.argsForCall[1][0]).toMatch('build ios');
                    done();
                });
            });

            it('cordova run <platform>', function(done) {
                options.cmd = 'cordova run ios';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios');
                    expect(shell.exec.argsForCall[1][0]).toMatch('run ios');
                    done();
                });
            });

            it('cordova emulate <platform>', function(done) {
                options.cmd = 'cordova emulate ios';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios');
                    expect(shell.exec.argsForCall[1][0]).toMatch('emulate ios');
                    done();
                });
            });

            it('not cordova prepare', function(done) {
                options.cmd = 'cordova prepare';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('prepare');
                    done();
                });
            });

            it('not cordova compile', function(done) {
                options.cmd = 'cordova compile';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('compile');
                    done();
                });
            });

            it('not cordova build', function(done) {
                options.cmd = 'cordova build';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('build');
                    done();
                });
            });

            it('not cordova run', function(done) {
                options.cmd = 'cordova run';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('run');
                    done();
                });
            });

            it('not cordova emulate', function(done) {
                options.cmd = 'cordova emulate';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('emulate');
                    done();
                });
            });

            it('not cordova create <path>', function(done) {
                options.cmd = 'cordova create my-app';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save ios');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('create my-app');
                    done();
                });
            });
        });

        describe('when no platform is specified', function() {
            beforeEach(function() {
                options.cmd = 'cordova run';
            });

            it('should not add a platform', function(done) {
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('run');
                    done();
                });
            });

            it('should ignore an option and not add a platform', function(done) {
                options.cmd = 'cordova run --emulator';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('run --emulator');
                    done();
                });
            });
            it('should ignore options and not add a platform', function(done) {
                options.cmd = 'cordova run --emulator --target="Sim"';
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add --save');
                    expect(shell.exec.mostRecentCall.args[0]).toMatch('run --emulator --target="Sim"');
                    done();
                });
            });
        });

        describe('when a platform does not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios';
                cordova.util.listPlatforms.andReturn([]);
            });

            it('should try to add the platform', function(done) {
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios');
                    expect(shell.exec.argsForCall[1][0]).toMatch('build ios');
                    done();
                });
            });
        });

        describe('when multiple platforms do not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios android';
                cordova.util.listPlatforms.andReturn([]);
            });

            it('should try to add all of the platforms', function(done) {
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios android');
                    expect(shell.exec.argsForCall[1][0]).toMatch('build ios');
                    done();
                });
            });
        });

        describe('when some platforms do not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios android wp8';
                cordova.util.listPlatforms.andReturn(['android']);
            });

            it('should try to add the missing platforms', function(done) {
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(shell.exec.argsForCall[0][0]).toMatch('platform add --save ios wp8');
                    expect(shell.exec.argsForCall[1][0]).toMatch('build ios');
                    done();
                });
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
                // return true if checking node_modules or cordova.js path
                return (filepath.match('node_modules') || filepath.match('cordova.js'));
            });
        });

        it('should add phonegap.js for ios', function(done) {
            phonegap.cordova(options);
            process.nextTick(function(){
                expect(shell.cp).toHaveBeenCalled();
                expect(shell.cp.mostRecentCall.args[1]).toMatch(/ios.*cordova\.js/);
                expect(shell.cp.mostRecentCall.args[2]).toMatch(/ios.*phonegap\.js/);
                done();
            });
        });

        it('should add phonegap.js for ios and android', function(done) {
            options.cmd = 'cordova build ios android';
            cordova.util.listPlatforms.andReturn(['ios', 'android']);
            phonegap.cordova(options);
            process.nextTick(function(){
                expect(shell.cp).toHaveBeenCalled();
                expect(shell.cp.calls.length).toEqual(2);
                expect(shell.cp.calls[0].args[1]).toMatch(/ios.*cordova\.js/);
                expect(shell.cp.calls[0].args[2]).toMatch(/ios.*phonegap\.js/);
                expect(shell.cp.calls[1].args[1]).toMatch(/android.*cordova\.js/);
                expect(shell.cp.calls[1].args[2]).toMatch(/android.*phonegap\.js/);
                done();
            });
        });
    });

    describe('adding phonegap.js deprecation warning', function() {
        describe('when app does not reference phonegap.js', function() {
            beforeEach(function() {
                // no phonegap.js reference found
                shell.grep.andReturn('');
                fs.existsSync.andCallFake(function(filepath) {
                    // return true if checking node_modules or cordova.js path
                    return (filepath.match('node_modules') || filepath.match('cordova.js'));
                });
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
                var warnSpy = createSpy('warning').andCallFake(function(message) {
                    expect(message).toMatch(/phonegap\.js/i);
                });
                phonegap.on('warn', warnSpy);
                phonegap.cordova(options);
                process.nextTick(function() {
                    expect(warnSpy).toHaveBeenCalled();
                    done(); // given time for warn event to be emitted
                });
            });
        });
    });
});
