/*
 * Module dependencies.
 */

var cordova = require('../../lib/cordova'),
    original = require('cordova').cordova_lib;

/*
 * Specification: cordova
 */

// ToDo: @carynbear phonegap is checking that cordova is a local dependency
describe('cordova.cordova', function() {
    xit('should be defined', function() {
        expect(cordova.cordova).toEqual(jasmine.any(Object));
        expect(cordova.cordova).toEqual(original.cordova);
    });
});

// ToDo: @carynbear phonegap is checking that cordova is a local dependency
describe('cordova.lib', function() {
    xit('should be defined', function() {
        expect(cordova.lib).toEqual(jasmine.any(Object));
        expect(cordova.lib).toEqual(original);
    });

    // ToDo: @carynbear phonegap is checking that cordova is a local dependency
    xit('should customize the binary name (binname)', function() {
        expect(cordova.lib.binname).toEqual('phonegap');
    });
});

describe('cordova.util', function() {
    it('should be defined', function() {
        expect(cordova.util).toEqual(jasmine.any(Object));
        expect(cordova.util.isCordova).toEqual(jasmine.any(Function));
    });
});
