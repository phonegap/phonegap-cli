var cli = require('../lib/cli');
var analytics = require('../lib/cli/analytics');
var request = require('request');

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
    describe('trackEvent', function() {
        var post_spy;
        beforeEach(function() {
            spyOn(analytics, 'hasOptedOut').andReturn(false);
            post_spy = spyOn(request, 'post');
        });
        it('should POST to metrics.phonegap.com on successfully-parsed commands', function() {
            analytics.trackEvent(["platform", "list"]);
            expect(post_spy).toHaveBeenCalled();
        });
        it('should attach command exit codes to event tracking', function() {
            analytics.trackEvent(["platform", "explode"], {exitCode:21});
            var dump = JSON.parse(post_spy.calls[0].args[0].form);
            expect(dump._exitCode).toEqual(21);
        });
        it('should track top-level commands in the short_message event field', function() {
            var cmds = ['serve', 'platform', 'plugins', 'version'];
            cmds.forEach(function(cmd) {
                analytics.trackEvent([cmd]);
                var last_call = post_spy.calls[post_spy.calls.length - 1];
                var dump = JSON.parse(last_call.args[0].form);
                expect(dump.short_message).toEqual(cmd);
            });
        });
        it('should track switches in the _switches event field', function() {
            var cmd = ['serve', '--yourself', '--verbose'];
            analytics.trackEvent(cmd);
            var dump = JSON.parse(post_spy.calls[0].args[0].form);
            expect(dump._flags).toContain('--yourself');
            expect(dump._flags).toContain('--verbose');
        });
        it('should track parameters in the _params event field', function() {
            var cmd = ['plugins', 'list'];
            analytics.trackEvent(cmd);
            var dump = JSON.parse(post_spy.calls[0].args[0].form);
            expect(dump._params).toContain('list');
        });
    });
});
