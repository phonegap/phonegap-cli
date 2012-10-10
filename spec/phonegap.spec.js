describe('phonegap', function() {
    var phonegap = require('../lib/phonegap');

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

        it('should throw error on unsupported environment', function() {
            expect(function() { phonegap.env('foo'); }).toThrow();
        });

        it('should not save an unsupported environment', function() {
            expect(function() { phonegap.env('foo'); }).toThrow();
            expect(phonegap.env()).toEqual('remote');
        });
    });
});
