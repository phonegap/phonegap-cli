/*
 * Module dependencies.
 */

var CLI = require('../../../lib/cli'),
    updateCheck = require('../../../lib/cli/util/update-check'),
    argv,
    cli;

/*
 * Specification: update checker
 */

describe('update checker', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];

        spyOn(process.stdout, 'write');
        spyOn(updateCheck, 'start');
    });

    it('should check for an update', function(done) {
        cli.argv(argv.concat(['help']), function() {
            expect(updateCheck.start).toHaveBeenCalled();
            done();
        });
    });
});
