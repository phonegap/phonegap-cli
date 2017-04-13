/*
 * Module dependencies.
 */

var updateCheck = require('../../../lib/cli/util/update-check'),
    orig_env;

/*
 * Specification: update checker
 */

function trigger_cli() {
    require('../../../lib/cli');
}

describe('update checker', function() {
    beforeEach(function() {
        // save process.env so that we can restore in afterEach()
        orig_env = process.env;
        // delete the cli module from require cache
        // so we can exercise its update logic in each test case
        // this only happens the first time the module gets required, thus why this exists.
        delete require.cache[require.resolve('../../../lib/cli')];
        spyOn(updateCheck, 'start');
    });
    afterEach(function() {
        process.env = orig_env;
    });

    it('should check for an update when not running as electron', function() {
        delete process.env.ELECTRON_RUN_AS_NODE;
        trigger_cli();
        expect(updateCheck.start).toHaveBeenCalled();
    });
    it('should NOT check for an update when running as electron', function() {
        process.env.ELECTRON_RUN_AS_NODE = true;
        trigger_cli();
        expect(updateCheck.start).not.toHaveBeenCalled();
    });
});
