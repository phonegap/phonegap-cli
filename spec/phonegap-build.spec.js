describe('phonegap-build', function() {
    var build = require('../lib/phonegap-build');

    describe('create command', function() {
        it('should exist', function() {
            expect(build.create).toBeDefined();
        });
    });

    describe('platform command', function() {
        it('should exist', function() {
            expect(build.platform).toBeDefined();
        });
    });
});
