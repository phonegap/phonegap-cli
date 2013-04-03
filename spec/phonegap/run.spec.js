/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.run(options, [callback])
 */

describe('phonegap.build(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(phonegap.local, 'run').andReturn(phonegap);
        spyOn(phonegap.remote, 'run').andReturn(phonegap);
        spyOn(cordova.platform, 'supports');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.run(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.run(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.run(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.run(options)).toEqual(phonegap);
    });

    describe('with local environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(platform, callback) {
                callback(true);
            });
        });

        it('should try to run the project locally', function() {
            var callback = function() {};
            phonegap.run(options, callback);
            expect(phonegap.local.run).toHaveBeenCalledWith(options, callback);
        });
    });

    describe('with remote environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(platform, callback) {
                callback(false);
            });
        });

        it('should try to run the project remotely', function() {
            var callback = function() {};
            phonegap.run(options, callback);
            expect(phonegap.remote.run).toHaveBeenCalledWith(options, callback);
        });
    });
});
