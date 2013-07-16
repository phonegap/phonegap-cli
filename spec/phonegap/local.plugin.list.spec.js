/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.local.plugin.list(options, [callback])
 */

describe('phonegap.local.plugin.list(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(cordova, 'plugin');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.local.plugin.list(options, callback);
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.local.plugin.list(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.local.plugin.list(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.local.plugin.list(options)).toEqual(phonegap);
    });

    it('should try to list the plugins', function() {
        phonegap.local.plugin.list(options);
        expect(cordova.plugin).toHaveBeenCalledWith(
            'list',
            [],
            jasmine.any(Function)
        );
    });

    describe('successfully list plugins', function() {
        beforeEach(function() {
            cordova.plugin.andCallFake(function(command, targets, callback) {
                callback(null, [
                    'org.cordova.core.geolocation',
                    'org.cordova.core.contacts'
                ]);
            });
        });

        it('should trigger callback without an error', function(done) {
            phonegap.local.plugin.list(options, function(e, plugins) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should trigger callback with a list of plugin names', function(done) {
            phonegap.local.plugin.list(options, function(e, plugins) {
                expect(plugins).toEqual([
                    'org.cordova.core.geolocation',
                    'org.cordova.core.contacts'
                ]);
                done();
            });
        });
    });

    describe('failed to list plugins', function() {
        beforeEach(function() {
            cordova.plugin.andCallFake(function(command, targets, callback) {
                callback(new Error('read access denied'));
            });
        });

        it('should trigger called with an error', function(done) {
            phonegap.local.plugin.list(options, function(e, plugins) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.local.plugin.list(options);
        });
    });
});
