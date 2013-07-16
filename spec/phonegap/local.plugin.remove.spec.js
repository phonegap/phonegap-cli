/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.local.plugin.remove(options, [callback])
 */

describe('phonegap.local.plugin.remove(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            id: ['org.apache.core.geolocation']
        };
        spyOn(cordova, 'plugin');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.local.plugin.remove(options, callback);
        }).toThrow();
    });

    it('should require options.id', function() {
        expect(function() {
            options.path = undefined;
            phonegap.local.plugin.remove(options, callback);
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.local.plugin.remove(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.local.plugin.remove(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.local.plugin.remove(options)).toEqual(phonegap);
    });

    it('should require at least one id', function(done) {
        options.id = [];
        phonegap.local.plugin.remove(options, function(e) {
            expect(e).toEqual(jasmine.any(Error));
            done();
        });
    });

    it('should try to remove the plugin', function() {
        phonegap.local.plugin.remove(options);
        expect(cordova.plugin).toHaveBeenCalledWith(
            'remove',
            options.id,
            jasmine.any(Function)
        );
    });

    describe('successfully removed plugin', function() {
        beforeEach(function() {
            cordova.plugin.andCallFake(function(command, targets, callback) {
                callback();
            });
        });

        it('should trigger called without an error', function(done) {
            phonegap.local.plugin.remove(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed to remove plugin', function() {
        beforeEach(function() {
            cordova.plugin.andCallFake(function(command, targets, callback) {
                callback(new Error('write access denied'));
            });
        });

        it('should trigger called with an error', function(done) {
            phonegap.local.plugin.remove(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.local.plugin.remove(options);
        });
    });
});
