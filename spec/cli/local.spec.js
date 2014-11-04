/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help local
 */

describe('phonegap help local', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+local \[command\].*\r?\n/i);
        });
    });

    describe('$ phonegap local', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap help local', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'local']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap local help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap local --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });

    describe('$ phonegap local -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local/i);
        });
    });
});

/*
 * Specification: $ phonegap local [command]
 */

describe('phonegap local <command>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(cli, 'cordova');
    });

    it('should redirect to cordova', function() {
        cli.argv(argv.concat(['local', 'build', 'ios', 'android', '--verbose']));
        expect(cli.cordova.mostRecentCall.args[0]).toMatch({
            cmd: ['cordova', 'build', 'ios', 'android', '--verbose']
        });
    });
});
