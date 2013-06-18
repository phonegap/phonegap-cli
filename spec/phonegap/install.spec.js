/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.install(options, [callback])
 */

describe('phonegap.install(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(phonegap.local, 'install').andReturn(phonegap);
        spyOn(phonegap.remote, 'install').andReturn(phonegap);
        spyOn(cordova.platform, 'supports');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.install(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.install(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.install(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.install(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.install(options)).toEqual(phonegap);
    });

    describe('with local environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(path, platform, callback) {
                callback(null);
            });
        });

        it('should try to install the app locally', function() {
            var callback = function() {};
            phonegap.install(options, callback);
            expect(phonegap.local.install).toHaveBeenCalledWith(options, callback);
        });
    });

    describe('with remote environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(path, platform, callback) {
                callback(new Error('could not find sdk'));
            });
        });

        it('should try to install the app remotely', function() {
            var callback = function() {};
            phonegap.install(options, callback);
            expect(phonegap.remote.install).toHaveBeenCalledWith(options, callback);
        });
    });
});
