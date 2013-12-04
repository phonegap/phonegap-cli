/*
 * Module dependencies.
 */

var localBuild = require('../../lib/phonegap/local.build'),
    PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.platform.update(options, [callback])
 */

describe('phonegap.platform.update(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(process.stderr, 'write');
        spyOn(cordova, 'platform');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.platform.update(options, callback);
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.platform.update(options, callback);
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.platform.update(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.platform.update(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.platform.update(options)).toEqual(phonegap);
    });

    it('should require at least one platform', function(done) {
        options.platforms = [];
        phonegap.platform.update(options, function(e) {
            expect(e).toEqual(jasmine.any(Error));
            done();
        });
    });

    it('should try to update the platform', function() {
        phonegap.platform.update(options);
        expect(cordova.platform).toHaveBeenCalledWith(
            'update',
            options.platforms,
            jasmine.any(Function)
        );
    });

    describe('successful update', function() {
        beforeEach(function() {
            cordova.platform.andCallFake(function(symbol, platforms, callback) {
                callback();
            });
        });

        it('should trigger called without an error', function(done) {
            phonegap.platform.update(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed update', function() {
        beforeEach(function() {
            cordova.platform.andCallFake(function(symbol, platforms, callback) {
                callback(new Error('write access denied'));
            });
        });

        it('should trigger called with an error', function(done) {
            phonegap.platform.update(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.platform.update(options);
        });
    });
});
