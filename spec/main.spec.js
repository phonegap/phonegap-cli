/*!
 * Module dependencies.
 */

var PhoneGap = require('../lib/phonegap'),
    phonegap = require('../lib/main');

/*!
 * Specification: phonegap.
 */

describe('main', function() {
    it('should be an instance of PhoneGap', function() {
        expect(phonegap).toEqual(jasmine.any(PhoneGap));
    });
});
