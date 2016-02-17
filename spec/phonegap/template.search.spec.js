/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    opener = require('../../lib/phonegap/util/opener'),
    phonegap,
    options;

/*
 * Specification: phonegap.template.search(options, [callback])
 */

describe('phonegap.template.search(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(opener, 'open');
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.template.search(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.template.search(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.template.search(options)).toEqual(phonegap);
    });

    it('should open the browser to npmjs.com', function(done) {
        phonegap.template.search(options, function(e, data) {
            expect(opener.open).toHaveBeenCalledWith(
                'https://www.npmjs.com/browse/keyword/cordova:template'
            );
            done();
        });
    });
});
