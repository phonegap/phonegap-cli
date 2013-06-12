/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.local.install(options, [callback])
 */

describe('phonegap.local.install(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(process.stdout, 'write');
        spyOn(project, 'cd').andReturn(true);
        spyOn(cordova, 'emulate');
        spyOn(cordova, 'run');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.local.install(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.local.install(options, function(e) {});
        }).toThrow();
    });


    it('should not require options.device', function() {
        expect(function() {
            options.device = undefined;
            phonegap.local.install(options);
        }).not.toThrow();
    });

    it('should not require options.emulator', function() {
        expect(function() {
            options.emulator = undefined;
            phonegap.local.install(options);
        }).not.toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.local.install(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.local.install(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.local.install(options)).toEqual(phonegap);
    });

    describe('when target is device', function() {
        beforeEach(function() {
            options.device = true;
        });

        it('should install the app to the device', function() {
            phonegap.local.install(options);
            expect(cordova.run).toHaveBeenCalledWith(
                options.platforms,
                jasmine.any(Function)
            );
            expect(cordova.emulate).not.toHaveBeenCalled();
        });

        describe('on successful install', function() {
            beforeEach(function() {
                cordova.run.andCallFake(function(platforms, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                phonegap.local.install(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('on failed install', function() {
            beforeEach(function() {
                cordova.run.andCallFake(function(platforms, callback) {
                    callback(new Error('Ganon stole the binary'));
                });
            });

            it('should call callback with an error', function(done) {
                phonegap.local.install(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should fire "error" event', function(done) {
                phonegap.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
                phonegap.local.install(options);
            });
        });
    });

    describe('when target is emulator', function() {
        beforeEach(function() {
            options.emulator = true;
        });

        it('should install the app to the emulator', function() {
            phonegap.local.install(options);
            expect(cordova.emulate).toHaveBeenCalledWith(
                options.platforms,
                jasmine.any(Function)
            );
            expect(cordova.run).not.toHaveBeenCalled();
        });

        describe('on successful install', function() {
            beforeEach(function() {
                cordova.emulate.andCallFake(function(platforms, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                phonegap.local.install(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('on failed install', function() {
            beforeEach(function() {
                cordova.emulate.andCallFake(function(platforms, callback) {
                    callback(new Error('Ganon stole the binary'));
                });
            });

            it('should call callback with an error', function(done) {
                phonegap.local.install(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should fire "error" event', function(done) {
                phonegap.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
                phonegap.local.install(options);
            });
        });
    });

    describe('when no target is provided', function() {
        beforeEach(function() {
            options.device = undefined;
            options.emulator = undefined;
        });

        it('should try to install the app to a device', function() {
            phonegap.local.install(options);
            expect(cordova.run).toHaveBeenCalledWith(
                options.platforms,
                jasmine.any(Function)
            );
            expect(cordova.emulate).not.toHaveBeenCalled();
        });

        describe('on successful device install', function() {
            beforeEach(function() {
                cordova.run.andCallFake(function(platforms, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                phonegap.local.install(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('on failed device install', function() {
            beforeEach(function() {
                cordova.run.andCallFake(function(platforms, callback) {
                    callback(new Error('Ganon stole the binary'));
                });
            });

            it('should try to install the app to an emulator', function() {
                phonegap.local.install(options);
                expect(cordova.emulate).toHaveBeenCalledWith(
                    options.platforms,
                    jasmine.any(Function)
                );
            });

            describe('on successful install', function() {
                beforeEach(function() {
                    cordova.emulate.andCallFake(function(platforms, callback) {
                        callback(null);
                    });
                });

                it('should call callback without an error', function(done) {
                    phonegap.local.install(options, function(e) {
                        expect(e).toBeNull();
                        done();
                    });
                });
            });

            describe('on failed install', function() {
                beforeEach(function() {
                    cordova.emulate.andCallFake(function(platforms, callback) {
                        callback(new Error('Ganon stole the binary'));
                    });
                });

                it('should call callback with an error', function(done) {
                    phonegap.local.install(options, function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should fire "error" event', function(done) {
                    phonegap.on('error', function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                    phonegap.local.install(options);
                });
            });
        });
    });
});
