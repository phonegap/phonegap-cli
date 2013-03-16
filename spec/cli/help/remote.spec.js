/*
 * Module dependencies.
 */

var CLI = require('../../../lib/cli'),
    cli,
    stdout;

/*
 * Remote help command specification.
 */

describe('$ phonegap remote help', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap remote', function() {
        it('should output the remote help dialog', function() {
            cli.argv({ _: ['remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote help', function() {
        it('should output the remote help dialog', function() {
            cli.argv({ _: ['remote', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap help remote', function() {
        it('should output the remote help dialog', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote --help', function() {
        it('should output the remote help dialog', function() {
            cli.argv({ _: ['remote'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote -h', function() {
        it('should output the remote help dialog', function() {
            cli.argv({ _: ['remote'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });
});
