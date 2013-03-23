/*!
 * Module dependencies.
 */

var PhoneGap = require('../lib/phonegap'),
    phonegap = new PhoneGap();

/*!
 * PhoneGap specification.
 */

describe('phonegap', function() {
    it('should have an app function', function() {
        expect(phonegap.app).toEqual(jasmine.any(Function));
    });

    it('should have a create function', function() {
        expect(phonegap.create).toEqual(jasmine.any(Function));
    });

    it('should have a build function', function() {
        expect(phonegap.build).toEqual(jasmine.any(Function));
    });

    it('should have a local object', function() {
        expect(phonegap.local).toEqual(jasmine.any(Object));
    });

    it('should have a remote function', function() {
        expect(phonegap.remote).toEqual(jasmine.any(Object));
    });
});
