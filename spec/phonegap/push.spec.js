/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    fs = require('fs'),
    phonegap;

/*
 * Specification: phonegap.version()
 */

describe('phonegap.push()', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
    });

    it('should return a version object', function() {
        expect(phonegap.version()).toEqual(jasmine.any(Object));
    });

    describe('version object', function() {
        beforeEach(function() {
            spyOn(fs, 'readFileSync').andReturn('{ "version": "2.8.0-0.10.6" }');
        });

        it('should contain version.npm', function() {
            expect(phonegap.version().npm).toEqual('2.8.0-0.10.6');
        });

        it('should contain version.module', function() {
            expect(phonegap.version().module).toEqual('0.10.6');
        });

        it('should contain version.phonegap', function() {
            expect(phonegap.version().phonegap).toEqual('2.8.0');
        });
    });
});
