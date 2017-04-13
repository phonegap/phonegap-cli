var unknown = require('../../lib/cli/unknown');
var cnsl = require('../../lib/cli/util/console');
/*
 * Specification: $ phonegap unknown
 */

describe('phonegap unknown', function() {
    it('should output the unknown command as "noop"', function() {
        spyOn(cnsl, 'error');
        unknown({
            _:['node', 'phonegap.js', 'noop']
        }, function() {});
        expect(cnsl.error.mostRecentCall.args[0]).toMatch('noop');
        expect(cnsl.error.mostRecentCall.args[0]).toMatch(/is not a \w+ command/);
    });
});
