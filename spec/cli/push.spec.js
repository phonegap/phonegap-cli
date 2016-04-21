/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli;

/*
 * Specification: $ phonegap version
 */

describe('phonegap push', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        spyOn(phonegap, 'version').andReturn({
            npm: '2.8.0-0.10.6',
            module: '0.10.6',
            phonegap: '2.8.0'
        });
    });

    describe('$ phonegap help', function() {
        it('outputs info on the version command', function() {
            cli.argv(argv.concat(['help']));
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/Commands:[\w\W]*\s+version/i);
        });
    });

    describe('$ phonegap version', function() {
        it('should output with the format x.x.x', function() {
            cli.argv(argv.concat(['version']));
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
        });
    });

    describe('$ phonegap --version', function() {
        it('should output with the format x.x.x', function() {
            cli.argv(argv.concat(['--version']));
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
        });
    });

    describe('$ phonegap -v', function() {
        it('should output with the format x.x.x', function() {
            cli.argv(argv.concat(['-v']));
            expect(process.stdout.write.mostRecentCall.args[0]).toMatch(/\d+\.\d+\.\d+/);
        });
    });
});
