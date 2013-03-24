/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cordova = require('cordova'),
    events = require('events'),
    cli,
    stdout,
    emitter;

/*
 * Specification: phonegap help build.
 */

describe('phonegap help build', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+build <platform>.*\n/i);
        });
    });

    describe('$ phonegap build', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap help build', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });
});

/*
 * Specification: phonegap build <platform>.
 */

describe('phonegap build <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        emitter = new events.EventEmitter();
        spyOn(cli.local, 'build');
        spyOn(cli.remote, 'build');
        spyOn(cordova.platform, 'supports');
        //spyOn(process.stdout, 'write');
        //stdout = process.stdout.write;
    });

    describe('$ phonegap build android', function() {
        // how it should be

        //it('should try to build the android project', function() {
        //    cli.argv({ _: ['build', 'android'] });
        //    expect(phonegap.build).toHaveBeenCalledWith(
        //        { platforms: ['android'] }
        //    );
        //});

        //it('should support the "log" event', function() {
        //    cli.argv({ _: ['build', 'android'] });
        //    emitter.emit('log', 'ping log');
        //    expect(stdout.mostRecentCall.args[0]).toMatch('ping log');
        //});

        //it('should support the "warn" event', function() {
        //    cli.argv({ _: ['build', 'android'] });
        //    emitter.emit('warn', 'ping warn');
        //    expect(stdout.mostRecentCall.args[0]).toMatch('ping warn');
        //});

        //it('should support the "error" event', function() {
        //    cli.argv({ _: ['build', 'android'] });
        //    emitter.emit('error', 'ping error');
        //    expect(stdout.mostRecentCall.args[0]).toMatch('ping error');
        //});

        //it('should support the "complete" event', function() {
        //    cli.argv({ _: ['build', 'android'] });
        //    emitter.emit('complete', 'ping complete');
        //    expect(stdout.mostRecentCall.args[0]).toMatch('ping complete');
        //});

        describe('with local environment', function() {
            beforeEach(function() {
                cordova.platform.supports.andCallFake(function(platform, callback) {
                    callback(true);
                });
            });

            it('should build locally', function() {
                cli.argv({ _: ['build', 'android'] });
                expect(cli.local.build).toHaveBeenCalledWith(
                    { _: ['local', 'build', 'android'] },
                    jasmine.any(Function)
                );
            });
        });
    });
});
