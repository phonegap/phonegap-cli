/*!
 * Module dependencies.
 */

var PhoneGap = require('../lib/phonegap'),
    phonegap = new PhoneGap();

/*!
 * Specification: PhoneGap.
 */

describe('phonegap', function() {
    it('should define phonegap.app', function() {
        expect(phonegap.app).toEqual(jasmine.any(Function));
    });

    it('should define phonegap.create', function() {
        expect(phonegap.create).toEqual(jasmine.any(Function));
    });

    it('should define phonegap.remote', function() {
        expect(phonegap.remote).toEqual(jasmine.any(Object));
    });

    it('should define phonegap.remote.build', function() {
        expect(phonegap.remote.build).toEqual(jasmine.any(Function));
    });

    it('should define phonegap.remote.login', function() {
        expect(phonegap.remote.login).toEqual(jasmine.any(Function));
    });

    it('should define phonegap.remote.logout', function() {
        expect(phonegap.remote.logout).toEqual(jasmine.any(Function));
    });

    it('should define phonegap.template', function() {
        expect(phonegap.template).toEqual(jasmine.any(Object));
    });
});
