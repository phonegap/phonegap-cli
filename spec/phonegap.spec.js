/*!
 * Module dependencies.
 */

var PhoneGap = require('../lib/phonegap'),
    phonegap = new PhoneGap();

/*!
 * PhoneGap specification.
 */

describe('phonegap', function() {
    it('should have a create function', function() {
        expect(phonegap.create).toEqual(jasmine.any(Function));
    });
});
