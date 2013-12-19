/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    phonegap;

/*!
 * Specification: phonegap.plugin.add(options, [callback])
 */

describe('phonegap.plugin.add(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
    });

    it('should use phonegap.local.plugin.add', function() {
        expect(phonegap.plugin.add).toEqual(phonegap.local.plugin.add);
    });
});
