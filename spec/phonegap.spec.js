describe('phonegap', function() {
    var phonegap;

    beforeEach(function() {
        phonegap = require('../lib/phonegap');
    });

    describe('environment', function() {
        it('should default to local machine', function() {
            expect(phonegap.env()).toEqual('local');
        });

        it('should support local environment', function() {
            expect(phonegap.env('local')).toEqual('local');
        });

        it('should support remote environment', function() {
            expect(phonegap.env('remote')).toEqual('remote');
        });
    });
});
