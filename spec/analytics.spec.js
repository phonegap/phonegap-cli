var cli = require('../lib/cli');

function trigger_phonegap_cli() {
    require('../bin/phonegap');
}

describe('PhoneGap Analytics', function() {
    beforeEach(function() {
        // ensure we dont prompt for turning analytics on
        spyOn(cli.prototype.analytics, 'statusUnknown').andReturn(false);
    });
    it('should pass error objects from command invocations to analytics', function() {
        var fake_error = {message: 'yo dawg'};
        var track = spyOn(cli.prototype.analytics, 'trackEvent');
        spyOn(cli.prototype, 'argv').andCallFake(function(argv, cb) {
            cb(fake_error);
        });
        trigger_phonegap_cli();
        expect(track).toHaveBeenCalledWith(jasmine.any(Array), fake_error);
    });
});
