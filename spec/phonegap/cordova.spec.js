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
    });

    describe('add platforms before a command', function() {
        describe('with the type', function() {
            beforeEach(function() {
                cordova.util.listPlatforms.andReturn([]);
            });

            it('cordova prepare <platform>', function() {
                options.cmd = 'cordova prepare ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios');
            });

            it('cordova compile <platform>', function() {
                options.cmd = 'cordova compile ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios');
            });

            it('cordova build <platform>', function() {
                options.cmd = 'cordova build ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios');
            });

            it('cordova run <platform>', function() {
                options.cmd = 'cordova run ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios');
            });

            it('cordova emulate <platform>', function() {
                options.cmd = 'cordova emulate ios';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios');
            });

            it('not cordova prepare', function() {
                options.cmd = 'cordova prepare';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add ios');
            });

            it('not cordova compile', function() {
                options.cmd = 'cordova compile';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add ios');
            });

            it('not cordova build', function() {
                options.cmd = 'cordova build';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add ios');
            });

            it('not cordova run', function() {
                options.cmd = 'cordova run';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add ios');
            });

            it('not cordova emulate', function() {
                options.cmd = 'cordova emulate';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add ios');
            });

            it('not cordova create <path>', function() {
                options.cmd = 'cordova create my-app';
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).not.toMatch('platform add');
            });
        });

        describe('when a platform does not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios';
                cordova.util.listPlatforms.andReturn([]);
            });

            it('should try to add the platform', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios');
            });
        });

        describe('when multiple platforms do not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios android';
                cordova.util.listPlatforms.andReturn([]);
            });

            it('should try to add all of the platforms', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios android');
            });
        });

        describe('when some platforms do not exist', function() {
            beforeEach(function() {
                options.cmd = 'cordova build ios android wp8';
                cordova.util.listPlatforms.andReturn(['android']);
            });

            it('should try to add the missing platforms', function() {
                phonegap.cordova(options);
                expect(shell.exec.mostRecentCall.args[0]).toMatch('platform add ios wp8');
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
                    expect(shell.exec.calls[0].args[0]).toMatch('platform add ios');
                    expect(shell.exec.calls[1].args[0]).toMatch('cordova build ios');
                    done();
                });
            });
        });
    });
});
