/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    console = require('../../lib/cli/util/console'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote login
 */

describe('phonegap help remote login', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'remote']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+login.*\r?\n/i);
        });
    });

    describe('$ phonegap help remote login', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'remote', 'login']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'login', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'login', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'login', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });
});

/*
 * Specification: $ phonegap remote login
 */

describe('phonegap remote login', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(phonegap.remote, 'login');
        spyOn(console, 'prompt');
    });

    describe('$ phonegap remote login', function() {
        it('should try to login', function() {
            cli.argv(argv.concat(['remote', 'login']));
            expect(phonegap.remote.login).toHaveBeenCalledWith(
                jasmine.any(Object),
                jasmine.any(Function)
            );
        });

        describe('successful login', function() {
            beforeEach(function() {
                phonegap.remote.login.andCallFake(function(argv, callback) {
                    phonegap.emit('login');
                    callback(null, {});
                });
            });

            it('should prompt for username and password', function() {
                cli.argv(argv.concat(['remote', 'login']));
                expect(console.prompt).toHaveBeenCalled();
            });

            it('should trigger callback without an error', function(done) {
                cli.argv(argv.concat(['remote', 'login']), function(e, api) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with API object', function(done) {
                cli.argv(argv.concat(['remote', 'login']), function(e, api) {
                    expect(api).toBeDefined();
                    done();
                });
            });
        });

        describe('failed login', function() {
            beforeEach(function() {
                phonegap.remote.login.andCallFake(function(argv, callback) {
                    callback(new Error('Invalid password'));
                });
            });

            it('should trigger callback with an error', function(done) {
                cli.argv(argv.concat(['remote', 'login']), function(e, api) {
                    expect(e).toBeDefined();
                    done();
                });
            });

            it('should trigger callback without an API object', function(done) {
                cli.argv(argv.concat(['remote', 'login']), function(e, api) {
                    expect(api).not.toBeDefined();
                    done();
                });
            });
        });
    });

    describe('$ phonegap remote login --username zelda', function() {
        it('should try to login', function() {
            cli.argv(argv.concat(['remote', 'login', '--username', 'zelda']));
            expect(phonegap.remote.login).toHaveBeenCalledWith(
                jasmine.objectContaining({ username: 'zelda', password: undefined }),
                jasmine.any(Function)
            );
        });
    });

    describe('$ phonegap remote login -u zelda', function() {
        it('should try to login', function() {
            cli.argv(argv.concat(['remote', 'login', '-u', 'zelda']));
            expect(phonegap.remote.login).toHaveBeenCalledWith(
                jasmine.objectContaining({ username: 'zelda', password: undefined }),
                jasmine.any(Function)
            );
        });
    });

    describe('$ phonegap remote login --password tr1force', function() {
        it('should try to login', function() {
            cli.argv(argv.concat(['remote', 'login', '--password', 'tr1force']));
            expect(phonegap.remote.login).toHaveBeenCalledWith(
                jasmine.objectContaining({ username: undefined, password: 'tr1force' }),
                jasmine.any(Function)
            );
        });
    });

    describe('$ phonegap remote login -p tr1force', function() {
        it('should try to login', function() {
            cli.argv(argv.concat(['remote', 'login', '-p', 'tr1force']));
            expect(phonegap.remote.login).toHaveBeenCalledWith(
                jasmine.objectContaining({ username: undefined, password: 'tr1force' }),
                jasmine.any(Function)
            );
        });
    });

    describe('$ phonegap remote login --username zelda --password tr1force', function() {
        it('should try to login', function() {
            cli.argv(argv.concat(['remote', 'login', '--username', 'zelda', '--password', 'tr1force']));
            expect(phonegap.remote.login).toHaveBeenCalledWith(
                jasmine.objectContaining({ username: 'zelda', password: 'tr1force' }),
                jasmine.any(Function)
            );
        });
    });

    describe('login event', function() {
        describe('no username and no password', function() {
            it('should prompt for username', function() {
                phonegap.emit('login', {}, function() {});
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.username).toBeUndefined();
            });

            it('should prompt for password', function() {
                phonegap.emit('login', {}, function() {});
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.password).toBeUndefined();
            });
        });

        describe('with username and no password', function() {
            it('should not prompt for username', function() {
                phonegap.emit('login', { username: 'zelda' }, function() {});
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.username).toEqual('zelda');
            });

            it('should prompt for password', function() {
                phonegap.emit('login', { username: 'zelda' }, function() {});
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.password).toBeUndefined();
            });
        });

        describe('no username and with password', function() {
            it('should prompt for username', function() {
                phonegap.emit('login', { password: 'tr1force' }, function() {});
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.username).toBeUndefined();
            });

            it('should not prompt for password', function() {
                phonegap.emit('login', { password: 'tr1force' }, function() {});
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.password).toEqual('tr1force');
            });
        });

        describe('with username and with password', function() {
            it('should not prompt for username', function() {
                phonegap.emit('login',
                    { username: 'zelda', password: 'tr1force' },
                    function() {}
                );
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.username).toEqual('zelda');
            });

            it('should not prompt for password', function() {
                phonegap.emit('login',
                    { username: 'zelda', password: 'tr1force' },
                    function() {}
                );
                expect(console.prompt).toHaveBeenCalled();
                expect(console.prompt.mostRecentCall.args[0].override.password).toEqual('tr1force');
            });
        });

        describe('successful prompt', function() {
            beforeEach(function() {
                console.prompt.andCallFake(function(options, callback) {
                    callback(null, { username: 'zelda', password: 'tr1force' });
                });
            });

            it('should trigger callback without an error', function(done) {
                phonegap.emit('login', {}, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with username and password', function(done) {
                phonegap.emit('login', {}, function(e, data) {
                    expect(data).toEqual({ username: 'zelda', password: 'tr1force' });
                    done();
                });
            });
        });

        describe('failed prompt', function() {
            beforeEach(function() {
                console.prompt.andCallFake(function(options, callback) {
                    callback(new Error('prompt was cancelled'));
                });
            });

            it('should trigger callback with an error', function(done) {
                phonegap.emit('login', {}, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
