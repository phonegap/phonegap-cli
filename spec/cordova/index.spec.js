/*
 * Module dependencies.
 */

var cordova = require('../../lib/cordova')

/*
 * Specification: cordova
 */

//ToDo: @carynbear this export should probably be renamed
describe('cordova.cordova', function() {
    it('should be defined', function() {
        expect(cordova.cordova).toEqual(jasmine.any(Object));
    });
});


describe('cordova.util', function() {
    it('should be defined', function() {
        expect(cordova.util).toEqual(jasmine.any(Object));
        expect(cordova.util.isCordova).toEqual(jasmine.any(Function));
    });
});
