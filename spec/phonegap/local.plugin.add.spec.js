/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.local.plugin.add(options, [callback])
 */

describe('phonegap.local.plugin.add(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            path: ['/path/to/plugin']
        };
        spyOn(cordova, 'plugin');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.local.plugin.add(options, callback);
        }).toThrow();
    });

    it('should require options.path', function() {
        expect(function() {
            options.path = undefined;
            phonegap.local.plugin.add(options, callback);
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.local.plugin.add(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.local.plugin.add(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.local.plugin.add(options)).toEqual(phonegap);
    });

    it('should require at least one path', function(done) {
        options.path = [];
        phonegap.local.plugin.add(options, function(e) {
            expect(e).toEqual(jasmine.any(Error));
            done();
        });
    });

    it('should try to add the plugin', function() {
        phonegap.local.plugin.add(options);
        expect(cordova.plugin).toHaveBeenCalledWith(
            'add',
            options.path,
            jasmine.any(Function)
        );
    });

    describe('successfully added plugin', function() {
        beforeEach(function() {
            cordova.plugin.andCallFake(function(command, targets, callback) {
                callback();
            });
        });

        it('should trigger called without an error', function(done) {
            phonegap.local.plugin.add(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed to add plugin', function() {
        beforeEach(function() {
            cordova.plugin.andCallFake(function(command, targets, callback) {
                callback(new Error('write access denied'));
            });
        });

        it('should trigger called with an error', function(done) {
            phonegap.local.plugin.add(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.local.plugin.add(options);
        });
    });
});
