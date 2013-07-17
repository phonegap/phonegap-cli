/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli;

/*
 * Specification: $ phonegap unknown
 */

describe('phonegap unknown', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
    });

    describe('$ phonegap noop', function() {
        it('should output the unknown command as "noop"', function() {
            cli.argv({ _: ['noop'] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch('noop');
        });
    });

    describe('$ phonegap local noop', function() {
        it('should output the unknown command as "noop"', function() {
            cli.argv({ _: ['local', 'noop'] });
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch('noop');
        });
    });
});
