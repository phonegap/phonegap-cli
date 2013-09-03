/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote
 */

describe('phonegap help remote', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+remote \[command\].*\r?\n/i);
        });
    });

    describe('$ phonegap remote', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap help remote', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote/i);
        });
    });

    describe('$ phonegap remote -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote'], h: true });
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
    });

    describe('unknown command', function() {
        it('should output the unknown command', function() {
            spyOn(cli, 'unknown');
            cli.argv({ _: ['remote', 'noop'] });
            expect(cli.unknown).toHaveBeenCalledWith(
                { _: ['remote', 'noop'] },
                jasmine.any(Function)
            );
        });
    });
});
