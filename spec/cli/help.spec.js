/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli;

/*
 * Specification: $ phonegap help
 */

describe('phonegap help', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
    });

    describe('$ phonegap', function() {
        it('should output the usage information', function() {
            cli.argv(argv);
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap help', function() {
        it('should output the usage information', function() {
            cli.argv(argv.concat(['help']));
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap --help', function() {
        it('should output the usage information', function() {
            cli.argv(argv.concat(['--help']));
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });

    describe('$ phonegap -h', function() {
        it('should output the usage information', function() {
            cli.argv(argv.concat(['-h']));
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
        });
    });
});
