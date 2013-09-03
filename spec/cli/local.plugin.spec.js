/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help local plugin
 */

describe('phonegap help local plugin', function() {
    beforeEach(function() {
        cli = new CLI();
        //spyOn(phonegap.local, 'plugin');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help local plugin', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'local'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+plugin <command>.*\r?\n/i);
        });
    });

    describe('$ phonegap local plugin', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['local', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin <command>/i);
        });
    });

    describe('$ phonegap help local plugin', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'local', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin <command>/i);
        });
    });

    describe('$ phonegap local plugin help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin <command>/i);
        });
    });

    describe('$ phonegap local plugin --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin <command>/i);
        });
    });

    describe('$ phonegap local plugin -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin <command>/i);
        });
    });
});

/*
 * Specification: $ phonegap local plugin [command]
 */

describe('phonegap local plugin <command>', function() {
    beforeEach(function() {
        cli = new CLI();
    });

    describe('unknown command', function() {
        it('should output the unknown command', function() {
            spyOn(cli, 'unknown');
            cli.argv({ _: ['local', 'plugin', 'noop'] });
            expect(cli.unknown).toHaveBeenCalledWith(
                { _: ['local', 'plugin', 'noop'] },
                jasmine.any(Function)
            );
        });
    });
});
