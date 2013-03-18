/*
 * Module dependencies.
 */

var prompt = require('prompt'),
    config = require('../../lib/common/config'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help remote login.
 */

describe('phonegap help remote login', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+login.*\n/i);
        });
    });

    describe('$ phonegap help remote login', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'remote', 'login'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'login', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'login'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'login'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });
});

/*
 * Specification: phonegap remote login.
 */

describe('phonegap remote login', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(config.global, 'load');
    });

    describe('$ phonegap remote login', function() {
        it('should try to lookup account', function() {
            cli.argv({ _: ['remote', 'login'] });
            expect(config.global.load).toHaveBeenCalled();
        });

        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['remote', 'login'] });
                expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });

            describe('successful login', function() {
                beforeEach(function() {
                    cli.phonegap.remote.login.andCallFake(function(argv, callback) {
                        callback(null, {});
                    });
                });

                it('should trigger callback without an error', function(done) {
                    cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with API object', function(done) {
                    cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                        expect(api).toBeDefined();
                        done();
                    });
                });
            });

            describe('failed login', function() {
                beforeEach(function() {
                    cli.phonegap.remote.login.andCallFake(function(argv, callback) {
                        callback(new Error('Invalid password'));
                    });
                });

                it('should trigger callback with an error', function(done) {
                    cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                        expect(e).toBeDefined();
                        done();
                    });
                });

                it('should trigger callback without an API object', function(done) {
                    cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                        expect(api).not.toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should prompt for username', function() {
                cli.argv({ _: ['remote', 'login'] });
                expect(prompt.get).toHaveBeenCalled();
                expect(prompt.get.mostRecentCall.args[0].properties.username).toBeDefined();
                expect(prompt.get.mostRecentCall.args[0].properties.username.required).toBe(true);
            });

            it('should prompt for password', function() {
                cli.argv({ _: ['remote', 'login'] });
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
                    cli.argv({ _: ['remote', 'login'] });
                    expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });

                describe('successful login', function() {
                    beforeEach(function() {
                        cli.phonegap.remote.login.andCallFake(function(argv, callback) {
                            callback(null, {});
                        });
                    });

                    it('should trigger callback without an error', function(done) {
                        cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                            expect(e).toBeNull();
                            done();
                        });
                    });

                    it('should trigger callback with API object', function(done) {
                        cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                            expect(api).toBeDefined();
                            done();
                        });
                    });
                });

                describe('failed login', function() {
                    beforeEach(function() {
                        cli.phonegap.remote.login.andCallFake(function(argv, callback) {
                            callback(new Error('Invalid password'));
                        });
                    });

                    it('should trigger callback with an error', function(done) {
                        cli.argv({ _: ['remote', 'login'] }, function(e, api) {
                            expect(e).toBeDefined();
                            done();
                        });
                    });

                    it('should trigger callback without an API object', function(done) {
                        cli.argv({ _: ['remote', 'login'] }, function(e, api) {
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
                    cli.argv({ _: ['remote', 'login'] });
                    expect(cli.phonegap.remote.login).not.toHaveBeenCalled();
                });

                it('should trigger callback with an error', function(done) {
                    cli.argv({ _: ['remote', 'login'] }, function(e) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });
            });
        });
    });

    describe('$ phonegap remote login --username zelda', function() {
        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['remote', 'login'], username: 'zelda' });
                expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should not prompt for username', function() {
                cli.argv({ _: ['remote', 'login'], username: 'zelda' });
                expect(prompt.override.username).toEqual('zelda');
            });

            it('should prompt for password', function() {
                cli.argv({ _: ['remote', 'login'], username: 'zelda' });
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
                    cli.argv({ _: ['remote', 'login'], username: 'zelda' });
                    expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap remote login -u zelda', function() {
        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['remote', 'login'], u: 'zelda' });
                expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should not prompt for username', function() {
                cli.argv({ _: ['remote', 'login'], u: 'zelda' });
                expect(prompt.override.username).toEqual('zelda');
            });

            it('should prompt for password', function() {
                cli.argv({ _: ['remote', 'login'], u: 'zelda' });
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
                    cli.argv({ _: ['remote', 'login'], u: 'zelda' });
                    expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap remote login --password tr1force', function() {
        describe('successful account lookup', function() {
            beforeEach(function() {
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: 'abc123' });
                });
            });

            it('should try to login', function() {
                cli.argv({ _: ['remote', 'login'], password: 'tr1force' });
                expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                    null,
                    jasmine.any(Function)
                );
            });
        });

        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should prompt for username', function() {
                cli.argv({ _: ['remote', 'login'], password: 'tr1force' });
                expect(prompt.override.username).not.toBeDefined();
            });

            it('should not prompt for password', function() {
                cli.argv({ _: ['remote', 'login'], password: 'tr1force' });
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
                    cli.argv({ _: ['remote', 'login'], password: 'tr1force' });
                    expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap remote login -p tr1force', function() {
        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should prompt for username', function() {
                cli.argv({ _: ['remote', 'login'], p: 'tr1force' });
                expect(prompt.override.username).not.toBeDefined();
            });

            it('should not prompt for password', function() {
                cli.argv({ _: ['remote', 'login'], p: 'tr1force' });
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
                    cli.argv({ _: ['remote', 'login'], p: 'tr1force' });
                    expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
            });
        });
    });

    describe('$ phonegap remote login --username zelda --password tr1force', function() {
        describe('failed account lookup', function() {
            beforeEach(function() {
                spyOn(prompt, 'get');
                spyOn(cli.phonegap.remote, 'login');
                config.global.load.andCallFake(function(callback) {
                    callback(null, { token: undefined });
                });
            });

            it('should not prompt for username', function() {
                cli.argv({ _: ['remote', 'login'], username: 'zelda', password: 'tr1force' });
                expect(prompt.override.username).toEqual('zelda');
            });

            it('should not prompt for password', function() {
                cli.argv({ _: ['remote', 'login'], username: 'zelda', password: 'tr1force' });
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
                    cli.argv({ _: ['remote', 'login'], username: 'zelda', password: 'tr1force' });
                    expect(cli.phonegap.remote.login).toHaveBeenCalledWith(
                        { username: 'zelda', password: 'tr1force' },
                        jasmine.any(Function)
                    );
                });
          });
        });
    });
});
