/*
 * Module dependencies.
 */

var phonegapbuild = require('../../lib/phonegap/util/phonegap-build'),
    PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    config = require('../../lib/common/config'),
    qrcode = require('qrcode-terminal'),
    phonegap,
    options;

/*
 * Specification: phonegap.remote.run(options, [callback])
 */

describe('phonegap.remote.run(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        spyOn(phonegap.remote, 'build');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.remote.run(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.remote.run(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.remote.run(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.remote.run(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.remote.run(options)).toEqual(phonegap);
    });

    it('should try to build', function() {
        phonegap.remote.run(options);
        expect(phonegap.remote.build).toHaveBeenCalled();
    });

    describe('successful build', function() {
        beforeEach(function() {
            phonegap.remote.build.andCallFake(function(options, callback) {
                callback(null, {
                    download: {
                        android: '/api/v1/apps/1234'
                    },
                    token: 'abc123'
                });
            });
            spyOn(config.global, 'load').andCallFake(function(callback) {
                callback(null, {
                    phonegap: {
                        token: 'abc123'
                    }
                });
            });
        });

        it('should generate a qrcode', function() {
            spyOn(qrcode, 'generate');
            phonegap.remote.run(options);
            expect(qrcode.generate).toHaveBeenCalled();
        });

        it('should call callback without an error', function(done) {
            phonegap.remote.run(options, function(e, data) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should call callback with a data object', function(done) {
            phonegap.remote.run(options, function(e, data) {
                expect(data).toEqual(jasmine.any(Object));
                done();
            });
        });
    });

    describe('failed build', function() {
        beforeEach(function() {
            phonegap.remote.build.andCallFake(function(opts, callback) {
                phonegapbuild.emit('error', new Error('Server did not respond'));
                callback(new Error('Server did not respond'));
            });
        });

        it('should call callback with an error', function(done) {
            phonegap.remote.run(options, function(e, data) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should fire "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.remote.run(options);
        });
    });
});
