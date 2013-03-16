/*
 * Module dependencies.
 */

var prompt = require('prompt'),
    config = require('../../../lib/common/config'),
    CLI = require('../../../lib/cli'),
    cli;

/*
 * Specification for login cli.
 */

describe('$ phonegap-build login', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(config.global, 'load');
    });

    describe('$ phonegap-build help', function() {
        it('outputs info on the login command', function() {
            cli.argv({ _: ['help'] });
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/Commands:[\w\W]*\s+login/i);
        });
    });

    describe('$ phonegap-build login', function() {
        it('should try to lookup account', function() {
            cli.argv({ _: ['login'] });
            expect(config.global.load).toHaveBeenCalled();
        });

        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['login'] });
                expect(cli.phonegap.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });

            describe('successful login', function() {
                beforeEach(function() {
                    cli.phonegap.login.andCallFake(function(argv, callback) {
                        callback(null, {});
                    });
                });

                it('should trigger callback without an error', function(done) {
                    cli.argv({ _: ['login'] }, function(e, api) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with API object', function(done) {
                    cli.argv({ _: ['login'] }, function(e, api) {
                        expect(api).toBeDefined();
                        done();
                    });
                });
            });

            describe('failed login', function() {
                beforeEach(function() {
                    cli.phonegap.login.andCallFake(function(argv, callback) {
                        callback(new Error('Invalid password'));
                    });
                });

                it('should trigger callback with an error', function(done) {
                    cli.argv({ _: ['login'] }, function(e, api) {
                        expect(e).toBeDefined();
                        done();
                    });
                });

                it('should trigger callback without an API object', function(done) {
                    cli.argv({ _: ['login'] }, function(e, api) {
                        expect(api).not.toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should prompt for username', function() {
                cli.argv({ _: ['login'] });
                expect(prompt.get).toHaveBeenCalled();
                expect(prompt.get.mostRecentCall.args[0].properties.username).toBeDefined();
                expect(prompt.get.mostRecentCall.args[0].properties.username.required).toBe(true);
            });

            it('should prompt for password', function() {
                cli.argv({ _: ['login'] });
                expect(prompt.get).toHaveBeenCalled();
                expect(prompt.get.mostRecentCall.args[0].properties.password).toBeDefined();
                expect(prompt.get.mostRecentCall.args[0].properties.password.required).toBe(true);
                expect(prompt.get.mostRecentCall.args[0].properties.password.hidden).toBe(true);
            });

            describe('successful prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        fn(null, { username: 'zelda', password: 'tr1force' });
                    });
                });

                it('should try to login', function() {
                    cli.argv({ _: ['login'] });
                    expect(cli.phonegap.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });

                describe('successful login', function() {
                    beforeEach(function() {
                        cli.phonegap.login.andCallFake(function(argv, callback) {
                            callback(null, {});
                        });
                    });

                    it('should trigger callback without an error', function(done) {
                        cli.argv({ _: ['login'] }, function(e, api) {
                            expect(e).toBeNull();
                            done();
                        });
                    });

                    it('should trigger callback with API object', function(done) {
                        cli.argv({ _: ['login'] }, function(e, api) {
                            expect(api).toBeDefined();
                            done();
                        });
                    });
                });

                describe('failed login', function() {
                    beforeEach(function() {
                        cli.phonegap.login.andCallFake(function(argv, callback) {
                            callback(new Error('Invalid password'));
                        });
                    });

                    it('should trigger callback with an error', function(done) {
                        cli.argv({ _: ['login'] }, function(e, api) {
                            expect(e).toBeDefined();
                            done();
                        });
                    });

                    it('should trigger callback without an API object', function(done) {
                        cli.argv({ _: ['login'] }, function(e, api) {
                            expect(api).not.toBeDefined();
                            done();
                        });
                    });
                });
            });

            describe('failed prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        fn(new Error('Invalid character'));
                    });
                });

                it('should not try to login', function() {
                    cli.argv({ _: ['login'] });
                    expect(cli.phonegap.login).not.toHaveBeenCalled();
                });

                it('should trigger callback with an error', function(done) {
                    cli.argv({ _: ['login'] }, function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });
    });

    describe('$ phonegap-build login --username zelda', function() {
        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['login'], username: 'zelda' });
                expect(cli.phonegap.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should not prompt for username', function() {
                cli.argv({ _: ['login'], username: 'zelda' });
                expect(prompt.override.username).toEqual('zelda');
            });

            it('should prompt for password', function() {
                cli.argv({ _: ['login'], username: 'zelda' });
                expect(prompt.override.password).not.toBeDefined();
            });

            describe('successful prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        var o = {
                            username: prompt.override.username || 'link',
                            password: prompt.override.password || 'tr1force'
                        };
                        fn(null, o);
                    });
                });

                it('should try to login', function() {
                    cli.argv({ _: ['login'], username: 'zelda' });
                    expect(cli.phonegap.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap-build login -u zelda', function() {
        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['login'], u: 'zelda' });
                expect(cli.phonegap.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should not prompt for username', function() {
                cli.argv({ _: ['login'], u: 'zelda' });
                expect(prompt.override.username).toEqual('zelda');
            });

            it('should prompt for password', function() {
                cli.argv({ _: ['login'], u: 'zelda' });
                expect(prompt.override.password).not.toBeDefined();
            });

            describe('successful prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        var o = {
                            username: prompt.override.username || 'link',
                            password: prompt.override.password || 'tr1force'
                        };
                        fn(null, o);
                    });
                });

                it('should try to login', function() {
                    cli.argv({ _: ['login'], u: 'zelda' });
                    expect(cli.phonegap.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap-build login --password tr1force', function() {
        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['login'], password: 'tr1force' });
                expect(cli.phonegap.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should prompt for username', function() {
                cli.argv({ _: ['login'], password: 'tr1force' });
                expect(prompt.override.username).not.toBeDefined();
            });

            it('should not prompt for password', function() {
                cli.argv({ _: ['login'], password: 'tr1force' });
                expect(prompt.override.password).toEqual('tr1force');
            });

            describe('successful prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        var o = {
                            username: prompt.override.username || 'zelda',
                            password: prompt.override.password || 'hyrule'
                        };
                        fn(null, o);
                    });
                });

                it('should try to login', function() {
                    cli.argv({ _: ['login'], password: 'tr1force' });
                    expect(cli.phonegap.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap-build login -p tr1force', function() {
        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should prompt for username', function() {
                cli.argv({ _: ['login'], p: 'tr1force' });
                expect(prompt.override.username).not.toBeDefined();
            });

            it('should not prompt for password', function() {
                cli.argv({ _: ['login'], p: 'tr1force' });
                expect(prompt.override.password).toEqual('tr1force');
            });

            describe('successful prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        var o = {
                            username: prompt.override.username || 'zelda',
                            password: prompt.override.password || 'hyrule'
                        };
                        fn(null, o);
                    });
                });

                it('should try to login', function() {
                    cli.argv({ _: ['login'], p: 'tr1force' });
                    expect(cli.phonegap.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap-build login --username zelda --password tr1force', function() {
        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should not prompt for username', function() {
                cli.argv({ _: ['login'], username: 'zelda', password: 'tr1force' });
                expect(prompt.override.username).toEqual('zelda');
            });

            it('should not prompt for password', function() {
                cli.argv({ _: ['login'], username: 'zelda', password: 'tr1force' });
                expect(prompt.override.password).toEqual('tr1force');
            });

            describe('successful prompt', function() {
                beforeEach(function() {
                    prompt.get.andCallFake(function(obj, fn) {
                        var o = {
                            username: prompt.override.username || 'link',
                            password: prompt.override.password || 'hyrule'
                        };
                        fn(null, o);
                    });
                });

                it('should try to login', function() {
                    cli.argv({ _: ['login'], username: 'zelda', password: 'tr1force' });
                    expect(cli.phonegap.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
          });
        });
    });
});
