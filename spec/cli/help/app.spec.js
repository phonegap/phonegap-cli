/*
 * Module dependencies.
 */

var CLI = require('../../../lib/cli'),
    cli,
    stdout;

/*
 * App help command specification.
 */

describe('$ phonegap app help', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap app help', function() {
        it('should output the app help dialog', function() {
            cli.argv({ _: ['app', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });

    describe('$ phonegap help app', function() {
        it('should output the app help dialog', function() {
            cli.argv({ _: ['help', 'app'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });

    describe('$ phonegap app --help', function() {
        it('should output the app help dialog', function() {
            cli.argv({ _: ['app'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });

    describe('$ phonegap app -h', function() {
        it('should output the app help dialog', function() {
            cli.argv({ _: ['app'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });
});
