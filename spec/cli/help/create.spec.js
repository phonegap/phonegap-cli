/*
 * Module dependencies.
 */

var CLI = require('../../../lib/cli'),
    cli,
    stdout;

/*
 * Create help command specification.
 */

describe('$ phonegap create help', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap create', function() {
        it('should output the create help dialog', function() {
            cli.argv({ _: ['create'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create help', function() {
        it('should output the create help dialog', function() {
            cli.argv({ _: ['create', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create --help', function() {
        it('should output the create help dialog', function() {
            cli.argv({ _: ['create'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create -h', function() {
        it('should output the create help dialog', function() {
            cli.argv({ _: ['create'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap help create', function() {
        it('should output the create help dialog', function() {
            cli.argv({ _: ['help', 'create'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });
});
