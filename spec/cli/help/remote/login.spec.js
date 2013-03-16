/*
 * Module dependencies.
 */

var CLI = require('../../../../lib/cli'),
    cli,
    stdout;

/*
 * Define the specification.
 */

describe('$ phonegap-build login help', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap-build login help', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['login', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ login/i);
        });
    });

    describe('$ phonegap-build login --help', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['login'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ login/i);
        });
    });

    describe('$ phonegap-build login -h', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['login'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ login/i);
        });
    });

    describe('$ phonegap-build help login', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['help', 'login'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ login/i);
        });
    });
});
