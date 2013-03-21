/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help local.
 */

describe('phonegap help local', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+local \[command\].*\n/i);
        });
    });

    describe('$ phonegap local', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap help local', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'local'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap local help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap local --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap local -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });
});

/*
 * Specification: phonegap local.
 */

//describe('phonegap local', function() {
//    beforeEach(function() {
//        cli = new CLI();
//    });
//});
