/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    phonegap;

/*!
 * Specification: phonegap.app(options, [callback])
 */

describe('phonegap.app(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
    });

    it('should use phonegap.serve', function() {
        expect(phonegap.app).toEqual(phonegap.serve);
    });
});
