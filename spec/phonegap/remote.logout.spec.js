/*!
 * Module dependencies.
 */

var phonegapbuild = require('../../lib/phonegap/util/phonegap-build'),
    PhoneGap = require('../../lib/phonegap'),
    phonegap,
    options;

/*!
 * Specification: phonegap.remote.logout(options, [callback])
 */

describe('phonegap.remote.logout(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(phonegapbuild, 'logout');
    });

    it('should require options parameter', function() {
        expect(function() {
            options = undefined;
            phonegap.remote.logout(options, function(){});
        }).toThrow();
    });

    it('should not require callback parameter', function() {
        expect(function() {
            phonegap.remote.logout(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.remote.logout(options)).toEqual(phonegap);
    });

    it('should try to call PhoneGapBuild logout', function() {
        phonegap.remote.logout(options);
        expect(phonegapbuild.logout).toHaveBeenCalledWith(
            options,
            jasmine.any(Function)
        );
    });

    describe('successful logout', function() {
        beforeEach(function() {
            phonegapbuild.logout.andCallFake(function(options, callback) {
                callback(null);
            });
        });

        it('should trigger callback without an error', function(done) {
            phonegap.remote.logout(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed logout', function() {
        beforeEach(function() {
            phonegapbuild.logout.andCallFake(function(options, callback) {
                callback(new Error('write access denied'));
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegap.remote.logout(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });
    });
});
