/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli;

/*
 * Specification: $ phonegap unknown
 */

describe('phonegap unknown', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');

    });

    //describe('$ phonegap noop', function() {
    //    it('should output the unknown command as "noop"', function() {
    //        cli.argv(argv.concat(['noop']));
    //        expect(process.stdout.write.mostRecentCall.args[0]).toMatch('noop');
    //    });
    //});
});
