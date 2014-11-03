/*
 * Module dependencies.
 */

var cordova = require('../../lib/cordova'),
    original = require('../../node_modules/cordova/node_modules/cordova-lib');

/*
 * Specification: cordova
 */

describe('cordova.cordova', function() {
    it('should be defined', function() {
        expect(cordova.cordova).toEqual(jasmine.any(Object));
        expect(cordova.cordova).toEqual(original.cordova);
    });
});

describe('cordova.lib', function() {
    it('should be defined', function() {
        expect(cordova.lib).toEqual(jasmine.any(Object));
        expect(cordova.lib).toEqual(original);
    });

    it('should customize the binary name (binname)', function() {
        expect(cordova.lib.binname).toEqual('phonegap');
    });
});

describe('cordova.util', function() {
    it('should be defined', function() {
        expect(cordova.util).toEqual(jasmine.any(Object));
        expect(cordova.util.isCordova).toEqual(jasmine.any(Function));
    });
});
