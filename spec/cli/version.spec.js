/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli;

/*
 * Specification: $ phonegap version
 */

describe('phonegap --version', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'version').andReturn({
            npm: '2.8.0-0.10.6',
            module: '0.10.6',
            phonegap: '2.8.0'
        });
    });

    describe('$ phonegap help', function() {
        it('outputs info on the version command', function() {
            cli.argv({ _: [ 'help' ] });
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/Commands:[\w\W]*\s+version/i);
        });
    });

    describe('$ phonegap version', function() {
        it('should output with the format x.x.x', function() {
            cli.argv({ _: [ 'version' ] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
        });
    });

    describe('$ phonegap --version', function() {
        it('should output with the format x.x.x', function() {
            cli.argv({ _: [], version: true });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
        });
    });

    describe('$ phonegap -v', function() {
        it('should output with the format x.x.x', function() {
            cli.argv({ _: [], v: true });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
        });
    });
});
