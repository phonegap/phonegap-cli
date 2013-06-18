/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.run(options, [callback])
 */

describe('phonegap.run(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(phonegap.local, 'run').andReturn(phonegap);
        spyOn(phonegap.remote, 'run').andReturn(phonegap);
        spyOn(cordova.platform, 'supports');
        spyOn(project, 'cd').andReturn(true);
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

    it('should change to project directory', function() {
        phonegap.run(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.run(options)).toEqual(phonegap);
    });

    describe('with local environment', function() {
        beforeEach(function() {
            cordova.platform.supports.andCallFake(function(path, platform, callback) {
                callback(null);
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
            cordova.platform.supports.andCallFake(function(path, platform, callback) {
                callback(new Error('could not find sdk'));
            });
        });

        it('should try to run the project remotely', function() {
            var callback = function() {};
            phonegap.run(options, callback);
            expect(phonegap.remote.run).toHaveBeenCalledWith(options, callback);
        });
    });
});
