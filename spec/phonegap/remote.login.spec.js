/*!
 * Module dependencies.
 */

var phonegapbuild = require('../../lib/phonegap/util/phonegap-build'),
    PhoneGap = require('../../lib/phonegap'),
    config = require('../../lib/common/config'),
    phonegap,
    options;

/*!
 * Specification: phonegap.remote.login(options, [callback])
 */

describe('phonegap.remote.login(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(phonegapbuild, 'login');
        spyOn(config.global, 'load');
    });

    it('should require options parameter', function() {
        expect(function() {
            options = undefined;
            phonegap.remote.login(options, function(){});
        }).toThrow();
    });

    it('should not require callback parameter', function() {
        expect(function() {
            phonegap.remote.login(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.remote.login(options)).toEqual(phonegap);
    });

    it('should try to login', function() {
        phonegap.remote.login(options);
        expect(phonegapbuild.login).toHaveBeenCalledWith(
            options,
            jasmine.any(Function)
        );
    });

    describe('on "login" event', function() {
        it('should map PhoneGapBuild "login" event', function(done) {
            phonegapbuild.login.andCallFake(function(options, callback) {
                phonegapbuild.emit('login', options, callback);
            });
            phonegap.on('login', function(options, callback) {
                expect(options).toEqual(options);
                expect(callback).toEqual(jasmine.any(Function));
                done();
            });
            phonegap.remote.login(options);
        });
    });

    describe('successful login', function() {
        beforeEach(function() {
            phonegapbuild.login.andCallFake(function(opt, callback) {
                callback(null, {});
            });
        });

        it('should trigger callback without an error', function(done) {
            phonegap.remote.login(options, function(e, api) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should trigger callback with API object', function(done) {
            phonegap.remote.login(options, function(e, api) {
                expect(api).toBeDefined();
                done();
            });
        });
    });

    describe('failed login', function() {
        beforeEach(function() {
            phonegapbuild.login.andCallFake(function(opt, callback) {
                phonegapbuild.emit('error', new Error('Ganon stole the token!'));
                callback(new Error('Ganon stole the token!'));
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegap.remote.login(options, function(e, api) {
                expect(e).toBeDefined();
                done();
            });
        });

        it('should trigger callback without an API object', function(done) {
            phonegap.remote.login(options, function(e, api) {
                expect(api).not.toBeDefined();
                done();
            });
        });

        it('should fire "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.remote.login(options);
        });
    });
});
