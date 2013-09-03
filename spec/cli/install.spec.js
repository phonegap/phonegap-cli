/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help install
 */

describe('phonegap help install', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+install <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap install', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['install'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap help install', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'install'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap install help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['install', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap install --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['install'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap install -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['install'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });
});

/*
 * Specification: phonegap install <platform>
 */

describe('phonegap install <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap, 'install');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap install android', function() {
        it('should try to install the app', function() {
            cli.argv({ _: ['install', 'android'] });
            expect(phonegap.install).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful install', function() {
            beforeEach(function() {
                phonegap.install.andCallFake(function(options, callback) {
                    callback(null, {});
                });
            });

            it('should trigger callback without an error', function(done) {
                cli.argv({ _: ['install', 'android'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with data', function(done) {
                cli.argv({ _: ['install', 'android'] }, function(e, data) {
                    expect(data).toEqual(jasmine.any(Object));
                    done();
                });
            });
        });

        describe('failed install', function() {
            beforeEach(function() {
                phonegap.install.andCallFake(function(options, callback) {
                    callback(new Error('server did not respond'));
                });
            });

            it('should trigger callback with an error', function(done) {
                cli.argv({ _: ['install', 'android'] }, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('$ phonegap install --device android', function() {
        it('should try to install the app on a device', function() {
            cli.argv({ _: ['install', 'android'], device: true });
            expect(phonegap.install).toHaveBeenCalledWith(
                { platforms: ['android'], device: true },
                jasmine.any(Function)
            );
        });
    });
});
