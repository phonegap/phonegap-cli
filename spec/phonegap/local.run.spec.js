/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    phonegap,
    options;

/*
 * Specification: phonegap.local.run(options, [callback])
 */

describe('phonegap.local.run(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(process.stdout, 'write');
        spyOn(phonegap.local, 'build');
        spyOn(phonegap.local, 'install');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.local.run(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.local.run(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.local.run(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.local.run(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.local.run(options)).toEqual(phonegap);
    });

    it('should try to build', function() {
        phonegap.local.run(options);
        expect(phonegap.local.build).toHaveBeenCalled();
    });

    describe('successful build', function() {
        beforeEach(function() {
            phonegap.local.build.andCallFake(function(options, callback) {
                callback(null);
            });
        });

        it('should install the app', function() {
            phonegap.local.run(options);
            expect(phonegap.local.install).toHaveBeenCalledWith(
                options,
                jasmine.any(Function)
            );
        });

        describe('successful install', function() {
            beforeEach(function() {
                phonegap.local.install.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                phonegap.local.run(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed install', function() {
            beforeEach(function() {
                phonegap.local.install.andCallFake(function(options, callback) {
                    var e = new Error('Ganon stole the binary');
                    phonegap.emit('error', e);
                    callback(e);
                });
            });

            it('should call callback with an error', function(done) {
                phonegap.local.run(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should fire "error" event', function(done) {
                phonegap.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
                phonegap.local.run(options);
            });
        });
    });

    describe('failed build', function() {
        beforeEach(function() {
            phonegap.local.build.andCallFake(function(opts, callback) {
                var e = new Error('file I/O error');
                phonegap.emit('error', e);
                callback(e);
            });
        });

        it('should call callback with an error', function(done) {
            phonegap.local.run(options, function(e, data) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should fire "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.local.run(options);
        });
    });
});
