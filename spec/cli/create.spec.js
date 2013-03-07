/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli;

/*
 * Create command specification.
 */

describe('$ phonegap create <path>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(cli.phonegap, 'create');
    });

    describe('$ phonegap help', function() {
        it('outputs info on the create command', function() {
            cli.argv({ _: ['help'] });
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/Commands:[\w\W]*\s+create <path>/i);
        });
    });

    describe('$ phonegap create ./my-app', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'] });
            expect(cli.phonegap.create).toHaveBeenCalled();
        });
    });
});
