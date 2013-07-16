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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+plugin <command>.*\n/i);
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
