/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli;

/*
 * Specification: $ phonegap help
 */

describe('phonegap', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
    });

    it('should output the usage information when invoked with no arguments eg $ phonegap', function() {
        cli.argv(argv);
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should output the usage information when invoked with help argument eg $ phonegap help', function() {
        cli.argv(argv.concat(['help']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should output the usage information when invoked with help flag eg $ phonegap --help', function() {
        cli.argv(argv.concat(['--help']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should output the usage information when invoked with abbreviated help flag $ phonegap -h', function() {
        cli.argv(argv.concat(['-h']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should output the help usage information when invoked with help eg $ phonegap help help', function() {
        cli.argv(argv.concat(['help', 'help']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should output the help usage information when invoked with help eg $ phonegap help --help', function() {
        cli.argv(argv.concat(['help', '--help']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should output the help usage information when invoked with help eg $ phonegap help -h', function() {
        cli.argv(argv.concat(['help', '-h']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage:/i);
    });

    it('should remove the .js extension from the binary (windows-specific)', function() {
        argv = ['node', '/user/local/bin/phonegap.js'];
        cli.argv(argv.concat(['help']));
        expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/usage: phonegap/i);
        expect(process.stdout.write.mostRecentCall.args[0]).not.toMatch('phonegap.js');
    });
});
