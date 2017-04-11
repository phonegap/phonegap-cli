

var CLI = require('../../lib/cli');

describe('phonegap report-issue', function() {
    it('should be defined', function() {
        var cli = new CLI();
        expect(cli['report-issue']).toBeDefined();
    });
});
