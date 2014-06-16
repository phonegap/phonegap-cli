/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help plugin
 */

describe('phonegap help plugin', function() {
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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+plugin \[command\].*\r?\n/i);
        });
    });

    describe('$ phonegap plugin', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['plugin']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin/i);
        });
    });

    describe('$ phonegap help plugin', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'plugin']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin/i);
        });
    });

    describe('$ phonegap plugin help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['plugin', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin/i);
        });
    });

    describe('$ phonegap plugin --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['plugin', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin/i);
        });
    });

    describe('$ phonegap plugin -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['plugin', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin/i);
        });
    });
});

/*
 * Specification: $ phonegap plugin [command]
 */

describe('phonegap plugin <command>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
    });

    describe('unknown command', function() {
        it('should output the unknown command', function() {
            spyOn(cli, 'unknown');
            cli.argv(argv.concat(['plugin', 'noop']));
            expect(cli.unknown.mostRecentCall.args[0]).toMatch({
                _: ['plugin', 'noop']
            });
        });
    });
});
