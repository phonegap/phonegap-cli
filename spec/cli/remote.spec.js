/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote
 */

describe('phonegap help remote', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+remote \[command\].*\n/i);
        });
    });

    describe('$ phonegap remote', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap help remote', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });
});

/*
 * Specification: $ phonegap remote [command]
 */

//describe('phonegap remote', function() {
//    beforeEach(function() {
//        cli = new CLI();
//    });
//});
