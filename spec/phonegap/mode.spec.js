/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    phonegapbuild = require('phonegap-build'),
    cordova = require('cordova'),
    phonegap,
    options;

/*
 * Specification: phonegap.mode(options, [callback])
 */

describe('phonegap.mode(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(cordova, 'on');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.mode(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.mode(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.mode(options)).toEqual(phonegap);
    });

    describe('default mode', function() {
        beforeEach(function() {
            options = { verbose: false };
        });

        it('should listen to PhoneGap/Build events', function() {
            phonegap.mode(options);
            expect(phonegapbuild.listeners('log').length).toBeGreaterThan(0);
            expect(phonegapbuild.listeners('warn').length).toBeGreaterThan(0);
            expect(phonegapbuild.listeners('error').length).toBeGreaterThan(0);
            expect(phonegapbuild.listeners('raw').length).toBeGreaterThan(0);
            expect(cordova.on).toHaveBeenCalledWith('before_library_download', jasmine.any(Function));
            expect(cordova.on).toHaveBeenCalledWith('after_library_download', jasmine.any(Function));
            expect(cordova.on).toHaveBeenCalledWith('library_download', jasmine.any(Function));
            expect(cordova.on).not.toHaveBeenCalledWith('log', jasmine.any(Function));
            expect(cordova.on).not.toHaveBeenCalledWith('warn', jasmine.any(Function));
        });
    });

    describe('verbose mode', function() {
        beforeEach(function() {
            options = { verbose: true };
        });

        it('should listen to PhoneGap/Build events', function() {
            phonegap.mode(options);
            expect(phonegapbuild.listeners('log').length).toBeGreaterThan(0);
            expect(phonegapbuild.listeners('warn').length).toBeGreaterThan(0);
            expect(phonegapbuild.listeners('error').length).toBeGreaterThan(0);
            expect(phonegapbuild.listeners('raw').length).toBeGreaterThan(0);
            expect(cordova.on).toHaveBeenCalledWith('before_library_download', jasmine.any(Function));
            expect(cordova.on).toHaveBeenCalledWith('after_library_download', jasmine.any(Function));
            expect(cordova.on).toHaveBeenCalledWith('library_download', jasmine.any(Function));
            expect(cordova.on).toHaveBeenCalledWith('log', jasmine.any(Function));
            expect(cordova.on).toHaveBeenCalledWith('warn', jasmine.any(Function));
        });
    });
});
