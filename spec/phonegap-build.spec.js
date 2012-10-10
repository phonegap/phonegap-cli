describe('phonegap-build', function() {
    var phonegapBuild = require('../lib/phonegap-build');

    describe('create command', function() {
        it('should exist', function() {
            expect(phonegapBuild.create).toBeDefined();
        });
    });
});
