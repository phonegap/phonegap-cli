/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('cordova'),
    events = require('events'),
    phonegap,
    emitter,
    options;

/*
 * Specification: phonegap.build
 */

describe('phonegap.build(options, callback)', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        emitter = new events.EventEmitter();
        spyOn(phonegap.local, 'build').andReturn(emitter);
        spyOn(phonegap.remote, 'build').andReturn(emitter);
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

    describe('with local environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(platform, callback) {
                callback(true);
            });
        });

        it('should try to build the project locally', function(done) {
            phonegap.build(options, function(e) {});
            process.nextTick(function() {
                expect(phonegap.local.build).toHaveBeenCalledWith(options);
                done();
            });
        });
    });

    describe('with remote environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(platform, callback) {
                callback(false);
            });
        });

        it('should try to build the project remotely', function(done) {
            phonegap.build(options, function(e) {});
            process.nextTick(function() {
                expect(phonegap.remote.build).toHaveBeenCalledWith(options);
                done();
            });
        });
    });
});
