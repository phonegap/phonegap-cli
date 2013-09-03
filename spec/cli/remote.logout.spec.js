/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote logout
 */

describe('phonegap help remote logout', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+logout.*\r?\n/i);
        });
    });

    describe('$ phonegap help remote logout', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'remote', 'logout'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote logout/i);
        });
    });

    describe('$ phonegap remote logout help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'logout', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote logout/i);
        });
    });

    describe('$ phonegap remote logout --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'logout'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote logout/i);
        });
    });

    describe('$ phonegap remote logout -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'logout'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote logout/i);
        });
    });
});
/*
 * Specification: $ phonegap remote logout
 */

describe('phonegap remote logout', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap.remote, 'logout');
        spyOn(process.stdout, 'write');
    });

    describe('$ phonegap remote logout', function() {
        it('should try to logout', function() {
            cli.argv({ _: ['remote', 'logout'] });
            expect(phonegap.remote.logout).toHaveBeenCalled();
        });

        describe('successful logout', function() {
            beforeEach(function() {
                phonegap.remote.logout.andCallFake(function(argv, callback) {
                    callback(null);
                });
            });

            it('should not return an error', function(done) {
                cli.argv({ _: ['remote', 'logout'] }, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed logout', function() {
            beforeEach(function() {
                phonegap.remote.logout.andCallFake(function(argv, callback) {
                    callback(new Error('Account does not exist.'));
                });
            });

            it('should not return an error', function(done) {
                cli.argv({ _: ['remote', 'logout'] }, function(e) {
                    expect(e).not.toBeNull();
                    done();
                });
            });
        });
    });
});
