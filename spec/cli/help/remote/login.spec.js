/*
 * Module dependencies.
 */

var CLI = require('../../../../lib/cli'),
    cli,
    stdout;

/*
 * Define the specification.
 */

describe('$ phonegap remote login help', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap remote login help', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['remote', 'login', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login --help', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['remote', 'login'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote login -h', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['remote', 'login'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });

    describe('$ phonegap remote help login', function() {
        it('should output the login help dialog', function() {
            cli.argv({ _: ['help', 'remote', 'login'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote login/i);
        });
    });
});
