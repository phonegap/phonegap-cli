/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli;

/*
 * Specification: $ phonegap help
 */

describe('phonegap help', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
    });

    describe('$ phonegap', function() {
        it('should output the usage information', function() {
            cli.argv({ _: [] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap help', function() {
        it('should output the usage information', function() {
            cli.argv({ _: [ 'help' ] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap --help', function() {
        it('should output the usage information', function() {
            cli.argv({ _: [], help: true });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap -h', function() {
        it('should output the usage information', function() {
            cli.argv({ _: [], h: true });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap help x', function() {
        it('should output the invalid usage error information', function() {
            cli.argv({ _: [ 'help','x' ] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/undefined command/i);
        });
    });

    describe('$ phonegap help local x', function() {
        it('should output the invalid usage error information', function() {
            cli.argv({ _: [ 'help','local','x' ] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/undefined command/i);
        });
    });
});
