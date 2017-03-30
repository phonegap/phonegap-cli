/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help analytics
 */

describe('phonegap help analytics', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(cli, 'analytics');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap analytics help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['analytics', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ analytics/i);
        });
    });

    describe('$ phonegap analytics --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['analytics', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ analytics/i);
        });
    });

    describe('$ phonegap analytics -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['analytics', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ analytics/i);
        });
    });
});

/*
 * Specification: $ phonegap analytics
 */

describe('phonegap analytics', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(cli, 'analytics').andReturn({
            on: function() {}
        });
    });

    describe('$ phonegap analytics', function() {
        it('should connect to phonegap analytics', function() {
            cli.argv(argv.concat(['analytics']));
            expect(cli.analytics).toHaveBeenCalled();
        });
    });

    describe('$ phonegap analytics on', function() {
        it('should connect to phonegap analytics', function() {
            cli.argv(argv.concat(['analytics', 'on']));
            expect(cli.analytics).toHaveBeenCalled();
            var analytics_params = cli.analytics.mostRecentCall.args[0]['_'];
            expect(analytics_params).toContain("analytics");
            expect(analytics_params).toContain("on");
        });
    });

    describe('$ phonegap analytics off', function() {
        it('should connect to phonegap analytics', function() {
            cli.argv(argv.concat(['analytics', 'off']));
            expect(cli.analytics).toHaveBeenCalled();
            var analytics_params = cli.analytics.mostRecentCall.args[0]['_'];
            expect(analytics_params).toContain("analytics");
            expect(analytics_params).toContain("off");
        });
    });
});
