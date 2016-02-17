/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help template search
 */

describe('phonegap help template search', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help template', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'template']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+search.*\r?\n/i);
        });
    });

    describe('$ phonegap help template search', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'template', 'search']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template search/i);
        });
    });

    describe('$ phonegap template search help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template', 'search', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template search/i);
        });
    });

    describe('$ phonegap template search --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template', 'search', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template search/i);
        });
    });

    describe('$ phonegap template search -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['template', 'search', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ template search/i);
        });
    });
});

/*
 * Specification: $ phonegap template search
 */

describe('phonegap template search', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.template, 'search');
        spyOn(phonegap, 'emit');
    });

    it('should call phonegap.template.search()', function() {
        cli.argv(argv.concat(['template', 'search']));
        expect(phonegap.template.search).toHaveBeenCalled();
    });
});
