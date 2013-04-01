/*!
 * Module dependencies.
 */

var phonegapbuild = require('../../lib/phonegap/util/phonegap-build'),
    PhoneGap = require('../../lib/phonegap'),
    config = require('../../lib/common/config'),
    phonegap,
    options;

/*!
 * Specification: phonegap.remote.login
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

    it('should try to find account', function() {
        phonegap.remote.login(options);
        expect(config.global.load).toHaveBeenCalled();
    });

    describe('when account exists', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(null, { token: 'abc123' });
            });
        });

        it('should try to login', function() {
            phonegap.remote.login(options);
            expect(phonegapbuild.login).toHaveBeenCalledWith(
                null,
                jasmine.any(Function)
            );
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

            it('should fire "err" event', function(done) {
                phonegap.on('err', function(message) {
                    expect(message).toEqual(jasmine.any(String));
                    done();
                });
                phonegap.remote.login(options);
            });
        });
    });

    describe('failed account lookup', function() {
        beforeEach(function() {
            config.global.load.andCallFake(function(callback) {
                callback(null, { token: undefined });
            });
        });

        it('should trigger "login" event', function(done) {
            phonegap.on('login', function(data, callback) {
                done();
            });
            phonegap.remote.login(options);
        });

        describe('"login" event parameters', function() {
            it('should have login data', function(done) {
                phonegap.on('login', function(data, callback) {
                    expect(data.username).toEqual('zelda');
                    done();
                });
                phonegap.remote.login({ username: 'zelda' });
            });

            it('should have a callback function', function(done) {
                phonegap.on('login', function(data, callback) {
                    expect(callback).toEqual(jasmine.any(Function));
                    done();
                });
                phonegap.remote.login(options);
            });
        });

        describe('successful login', function() {
            beforeEach(function() {
                phonegap.on('login', function(data, callback) {
                    callback(null, { username: 'zelda', password: 'tr1force' });
                });
            });

            it('should try to login', function() {
                phonegap.remote.login(options);
                expect(phonegapbuild.login).toHaveBeenCalledWith(
                    { username: 'zelda', password: 'tr1force' },
                    jasmine.any(Function)
                );
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

                it('should fire "err" event', function(done) {
                    phonegap.on('err', function(message) {
                        expect(message).toEqual(jasmine.any(String));
                        done();
                    });
                    phonegap.remote.login(options);
                });
            });
        });
    });
});
