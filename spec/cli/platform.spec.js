/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help platform
 */

describe('phonegap help platform', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+platform \[command\].*\r?\n/i);
        });
    });

    describe('$ phonegap platform', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['platform'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform/i);
        });
    });

    describe('$ phonegap help platform', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'platform'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform/i);
        });
    });

    describe('$ phonegap platform help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['platform', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform/i);
        });
    });

    describe('$ phonegap platform --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['platform'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform/i);
        });
    });

    describe('$ phonegap platform -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['platform'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform/i);
        });
    });
});

/*
 * Specification: $ phonegap platform [command]
 */

describe('phonegap platform <command>', function() {
    beforeEach(function() {
        cli = new CLI();
    });

    describe('unknown command', function() {
        it('should output the unknown command', function() {
            spyOn(cli, 'unknown');
            cli.argv({ _: ['platform', 'noop'] });
            expect(cli.unknown).toHaveBeenCalledWith(
                { _: ['platform', 'noop'] },
                jasmine.any(Function)
            );
        });
    });
});
