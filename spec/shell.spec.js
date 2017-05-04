var cli = require('../lib/cli');

function trigger_phonegap_cli() {
    require('../bin/phonegap');
}

describe('$ phonegap [options] commands', function() {
    var orig_args;
    beforeEach(function() {
        // delete the phonegap cli entry module from require cache
        // so we can exercise its logic in each test case
        delete require.cache[require.resolve('../bin/phonegap')];
        // ensure we dont prompt for turning analytics on
        spyOn(cli.prototype.analytics, 'statusUnknown').andReturn(false);
        // dont log analytics during tests - fake the cli out into thinking we opted out
        spyOn(cli.prototype.analytics, 'hasOptedOut').andReturn(true);
        orig_args = process.argv;
        spyOn(console, 'log');
    });
    afterEach(function() {
        process.argv = orig_args;
    });

    it('should support no arguments and post help', function() {
        process.argv = ['node', 'phonegap.js'];
        trigger_phonegap_cli();
        expect(console.log.mostRecentCall.args[0]).toMatch('Usage:');
    });

    it('should support commands', function() {
        process.argv = ['node', 'phonegap.js', 'version'];
        trigger_phonegap_cli();
        expect(console.log.mostRecentCall.args[0]).toMatch(/^\w+\.\w+\.\w+/);
    });

    it('should support options', function() {
        process.argv = ['node', 'phonegap.js', '--version'];
        trigger_phonegap_cli();
        expect(console.log.mostRecentCall.args[0]).toMatch(/^\w+\.\w+\.\w+/);
    });

    it('should have exit code 0 on successful commands', function() {
        process.argv = ['node', 'phonegap.js', '--version'];
        trigger_phonegap_cli();
        expect(process.exitCode).toEqual(0);
    });

    describe('on an error', function() {
        it('should have non-zero exit code', function() {
            // in updateCheck.spec, we clear require cache to exercise lib/cli properly.
            // here we re-require it just so we have a loaded cache and are using the
            // actual lib/cli module when spying on the cli prototype below.
            cli = require('../lib/cli');
            process.argv = ['node', 'phonegap.js', 'cordova', 'noop'];
            spyOn(cli.prototype, 'argv').andCallFake(function(args, cb) {
                // have argv just blast back an error object to the callback to trigger error flow
                cb({exitCode:1337});
            });
            trigger_phonegap_cli();
            expect(process.exitCode).toEqual(1337);
        });
    });
    /*
     * Unfortunately, the below does not work with jasmine-node
     * I really really tried to implement a test for the uncaught exception handler
     * to no avail. jasmine-node just exits prematurely.
     * Perhaps when we move to jasmine2 this can be tested properly.
    describe('when node throws an uncaught exception', function() {
        beforeEach(function() {
            jasmine.CATCH_EXCEPTIONS = false;
        });
        afterEach(function() {
            jasmine.CATCH_EXCEPTIONS = true;
        });
        it('should track the event in analytics', function(done) {
            spyOn(cli.prototype.analytics, 'trackEvent');
            spyOn(console, 'error');
            cli = require('../lib/cli');
            process.argv = ['node', 'phonegap.js', 'die', 'inafire'];
            spyOn(cli.prototype, 'argv').andCallFake(function(args, cb) {
                throw 'Poop!';
            });
            expect(trigger_phonegap_cli).toThrow();
            expect(console.error.mostRecentCall.args[0]).toMatch('There was an unhandled exception');
            expect(cli.prototype.analytics.trackEvent).toHaveBeenCalledWith(['die', 'inafire']);
            done();
        });
    });
    */
});
