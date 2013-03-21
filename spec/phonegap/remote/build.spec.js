/*
 * Module dependencies.
 */

var PhoneGap = require('../../../lib/phonegap'),
    build = new PhoneGap().local.build,
    cordova = require('cordova'),
    fs = require('fs'),
    callback,
    options;

/*
 * Specification: phonegap.local.build
 */

describe('local.build(options, [callback])', function() {
    beforeEach(function() {
        options = {
            platforms: ['android']
        };
        callback = function(e) {};
        spyOn(cordova, 'build');
        spyOn(build, 'addPlatform');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            build(options, callback);
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            build(options, callback);
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            build(options);
        }).not.toThrow();
    });

    it('should require at least one platform', function(done) {
        options.platforms = [];
        build(options, function(e) {
            expect(e).toEqual(jasmine.any(Error));
            done();
        });
    });

    it('should try to add the platform', function(done) {
        build(options, callback);
        process.nextTick(function() {
            expect(build.addPlatform).toHaveBeenCalledWith(
                options,
                jasmine.any(Function)
            );
            done();
        });
    });

    describe('successfully added platform', function() {
        beforeEach(function() {
            build.addPlatform.andCallFake(function(options, callback) {
                callback();
            });
        });

        it('should try to build the platform', function(done) {
            build(options, callback);
            process.nextTick(function() {
                expect(cordova.build).toHaveBeenCalledWith(
                    options.platforms,
                    jasmine.any(Function)
                );
                done();
            });
        });

        describe('successful build', function() {
            beforeEach(function() {
                cordova.build.andCallFake(function(platforms, callback) {
                    callback();
                });
            });

            it('should trigger called without an error', function(done) {
                build(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger "complete" event', function(done) {
                var emitter = build(options);
                emitter.on('complete', function() {
                    done();
                });
            });
        });

        describe('failed build', function() {
            beforeEach(function() {
                cordova.build.andCallFake(function(platforms, callback) {
                    throw new Error('write access denied');
                });
            });

            it('should trigger called with an error', function(done) {
                build(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should trigger "error" event', function(done) {
                var emitter = build(options);
                emitter.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('failure adding platform', function() {
        beforeEach(function() {
            build.addPlatform.andCallFake(function(options, callback) {
                callback(new Error('write access denied'));
            });
        });

        it('should trigger callback with an error', function(done) {
            build(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            var emitter = build(options);
            emitter.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });
    });
});

describe('local.build.addPlatform(options, callback)', function() {
    beforeEach(function() {
        options = {
            platforms: ['android'],
            emitter: {
                emit: function() {
                },
                on: function() {
                }
            }
        };
        callback = function(e) {};
        spyOn(fs, 'existsSync');
        spyOn(cordova, 'platform');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            build.addPlatform(options, callback);
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            build.addPlatform(options, callback);
        }).toThrow();
    });

    it('should require options.emitter', function() {
        expect(function() {
            options.emitter = undefined;
            build.addPlatform(options, callback);
        }).toThrow();
    });

    it('should require callback', function() {
        expect(function() {
            callback = undefined;
            build.addPlatform(options, callback);
        }).toThrow();
    });

    describe('platform directory exists', function() {
        beforeEach(function() {
            fs.existsSync.andReturn(true);
        });

        it('should trigger called without an error', function(done) {
            build.addPlatform(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('platform directory missing', function() {
        beforeEach(function() {
            fs.existsSync.andReturn(false);
        });

        it('should try to add the platform', function() {
            build.addPlatform(options, callback);
            expect(cordova.platform).toHaveBeenCalledWith(
                'add',
                options.platforms,
                jasmine.any(Function)
            );
        });

        describe('successfully added platform', function() {
            beforeEach(function() {
                cordova.platform.andCallFake(function(cmd, platforms, callback) {
                    callback();
                });
            });

            it('should trigger callback without an error', function(done) {
                build.addPlatform(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failure adding platform', function() {
            beforeEach(function() {
                cordova.platform.andCallFake(function(cmd, platforms, callback) {
                    throw new Error('write access denied');
                });
            });

            it('should trigger callback with an error', function(done) {
                build.addPlatform(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
