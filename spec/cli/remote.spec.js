/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote
 */

describe('phonegap help remote', function() {
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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+remote \[command\].*\r?\n/i);
        });
    });

    describe('$ phonegap remote', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap help remote', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'remote']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });
});

/*
 * Specification: $ phonegap remote [command]
 */

describe('phonegap remote <command>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
    });

    describe('unknown command', function() {
        it('should output the unknown command', function() {
            spyOn(cli, 'unknown');
            var noop_cmds = ['remote', 'noop'];
            cli.argv(argv.concat(noop_cmds));
            noop_cmds.forEach(function(arg) {
                expect(cli.unknown.mostRecentCall.args[0].processArgv).toContain(arg);
            });
        });
    });
});
