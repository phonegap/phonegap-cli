/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    phonegap;

/*!
 * Specification: phonegap.plugin.remove(options, [callback])
 */

describe('phonegap.plugin.remove(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
    });

    it('should use phonegap.local.plugin.remove', function() {
        expect(phonegap.plugin.remove).toEqual(phonegap.local.plugin.remove);
    });
});
