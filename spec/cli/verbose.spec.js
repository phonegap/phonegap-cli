/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli;

/*
 * Specification: $ phonegap --verbose <command>
 */

describe('phonegap --verbose <command>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap, 'build');
        spyOn(phonegap, 'mode');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
   });

    describe('$ phonegap --verbose <command>', function() {
        it('should enable verbose mode', function() {
            cli.argv({ _: ['build', 'android'], verbose: true });
            expect(phonegap.mode).toHaveBeenCalledWith({
                verbose: true
            });
        });
    });

    describe('$ phonegap -V <command>', function() {
        it('should enable verbose mode', function() {
            cli.argv({ _: ['build', 'android'], d: true });
            expect(phonegap.mode).toHaveBeenCalledWith({
                verbose: true
            });
        });
    });
});
