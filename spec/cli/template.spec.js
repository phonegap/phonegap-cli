/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help template
 */

describe('phonegap help template', function() {
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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+template.*\r?\n/i);
        });
    });

    describe('$ phonegap template', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template/i);
        });
    });

    describe('$ phonegap help template', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'template']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template/i);
        });
    });

    describe('$ phonegap template help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template/i);
        });
    });

    describe('$ phonegap template --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template/i);
        });
    });

    describe('$ phonegap template -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template/i);
        });
    });
});

/*
 * Specification: $ phonegap template noop
 */

describe('phonegap template noop', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap template noop', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['template', 'noop']));
            expect(stdout.mostRecentCall.args[0]).toMatch('not a phonegap command');
        });
    });
});
