/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: phonegap help install
 */

describe('phonegap help install', function() {
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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+install <platforms>.*\r?\n/i);
        });
    });

    describe('$ phonegap install', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install \[<platforms>\]/i);
        });
    });

    describe('$ phonegap help install', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'install']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install \[<platforms>\]/i);
        });
    });

    describe('$ phonegap install help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install \[<platforms>\]/i);
        });
    });

    describe('$ phonegap install --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install \[<platforms>\]/i);
        });
    });

    describe('$ phonegap install -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install \[<platforms>\]/i);
        });
    });
});

/*
 * Specification: phonegap install <platform>
 */

describe('phonegap install <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(cli, 'cordova');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap install android', function() {
        it('should delegate to `cordova run`', function() {
            cli.argv(argv.concat(['install', 'android']));
            expect(cli.cordova).toHaveBeenCalled();
        });

        it('should emit a deprecation message', function() {
            cli.argv(argv.concat(['install', 'android']));
            expect(stdout.calls[0].args[0]).toMatch('DEPRECATED');
        });
    });
});
