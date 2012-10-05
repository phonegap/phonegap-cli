describe('phonegap', function() {
    var phonegap;

    beforeEach(function() {
        phonegap = require('../lib/phonegap');
    });

    describe('environment', function() {
        it('should default to local machine', function() {
            expect(phonegap.env()).toEqual('local');
        });
    });
});
