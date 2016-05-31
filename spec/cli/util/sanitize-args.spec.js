
var sanitizeArgs = require('../../../lib/cli/util/sanitize-args');

describe('sanitize-args', function() {

    it('should exist and export a `clean` function', function(done) {

        expect(sanitizeArgs).toBeDefined();
        expect(sanitizeArgs.clean).toBeDefined();

        done();
    });
});
