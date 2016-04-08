/*
 * Module dependencies.
 */

var CLI = require('../../../lib/cli'),
    updateCheck = require('../../../lib/cli/util/update-check'),
    cli;

/*
 * Specification: update checker
 */

describe('update checker', function() {
    beforeEach(function() {
        spyOn(updateCheck, 'start');
    });

    it('should check for an update', function(done) {
        cli = new CLI(function() {
            expect(updateCheck.start).toHaveBeenCalled();
        });

        done();
    });
});
