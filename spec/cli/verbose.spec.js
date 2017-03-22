/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli;

/*
 * Specification: $ phonegap --verbose <command>
 */

describe('phonegap --verbose <command>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap, 'create');
        spyOn(phonegap, 'mode');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
    });

    describe('$ phonegap --verbose <command>', function() {
        it('should enable verbose mode', function() {
            cli.argv(argv.concat(['create', 'my-app', '--verbose']));
            expect(phonegap.mode).toHaveBeenCalledWith({
                verbose: true
            });
        });
    });

    describe('$ phonegap -V <command>', function() {
        it('should enable verbose mode', function() {
            // @TODO fix this test to use -V
            cli.argv(argv.concat(['create', 'my-app', '-d']));
            expect(phonegap.mode).toHaveBeenCalledWith({
                verbose: true
            });
        });
    });
});
