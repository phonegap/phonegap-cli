/*
 * Module dependencies.
 */

var phonegap = require('../../lib/phonegap'),
    emitter = require('../../lib/phonegap/util/emitter'),
    cordova = require('cordova'),
    options;

/*
 * Specification: phonegap.build
 */

describe('phonegap.build(options, callback)', function() {
    beforeEach(function() {
        options = {
            platforms: ['android']
        };
        phonegap.removeAllListeners();
        spyOn(phonegap.local, 'build').andReturn(phonegap);
        spyOn(phonegap.remote, 'build').andReturn(phonegap);
        spyOn(cordova.platform, 'supports');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.build(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.build(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.build(options);
        }).not.toThrow();
    });

    it('should return EventEmitter', function() {
        expect(phonegap.build(options)).toEqual(emitter);
    });

    describe('with local environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(platform, callback) {
                callback(true);
            });
        });

        it('should try to build the project locally', function() {
            var callback = function() {};
            phonegap.build(options, callback);
            expect(phonegap.local.build).toHaveBeenCalledWith(options, callback);
        });
    });

    describe('with remote environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(platform, callback) {
                callback(false);
            });
        });

        it('should try to build the project remotely', function() {
            var callback = function() {};
            phonegap.build(options, callback);
            expect(phonegap.remote.build).toHaveBeenCalledWith(options, callback);
        });
    });
});
