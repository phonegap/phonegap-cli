/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    phonegap;

/*!
 * Specification: phonegap.plugin.list(options, [callback])
 */

describe('phonegap.plugin.list(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
    });

    it('should use phonegap.local.plugin.list', function() {
        expect(phonegap.plugin.list).toEqual(phonegap.local.plugin.list);
    });
});
