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
        spyOn(cordova, 'emulate');
        spyOn(project, 'cd').andReturn(true);
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

    it('should install the app', function() {
        phonegap.local.install(options);
        expect(cordova.emulate).toHaveBeenCalledWith(
            options.platforms,
            jasmine.any(Function)
        );
    });

    describe('successful install', function() {
        beforeEach(function() {
            cordova.emulate.andCallFake(function(platforms, callback) {
                callback();
            });
        });

        it('should call callback without an error', function(done) {
            phonegap.local.install(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed install', function() {
        beforeEach(function() {
            cordova.emulate.andCallFake(function(platforms, callback) {
                throw new Error('Ganon stole the binary');
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
