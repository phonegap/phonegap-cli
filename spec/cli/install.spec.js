/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: phonegap help install
 */

describe('phonegap help install', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+install <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap install', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap help install', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'install']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap install help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap install --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ install [\S]+ <platform>/i);
        });
    });

    describe('$ phonegap install -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['install', '-h']));
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
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap, 'install');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap install android', function() {
        it('should try to install the app', function() {
            cli.argv(argv.concat(['install', 'android']));
            expect(phonegap.install.mostRecentCall.args[0]).toMatch({
                platforms: ['android']
            });
        });

        describe('successful install', function() {
            beforeEach(function() {
                phonegap.install.andCallFake(function(options, callback) {
                    callback(null, {});
                });
            });

            it('should trigger callback without an error', function(done) {
                cli.argv(argv.concat(['install', 'android']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with data', function(done) {
                cli.argv(argv.concat(['install', 'android']), function(e, data) {
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
                cli.argv(argv.concat(['install', 'android']), function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('$ phonegap install --device android', function() {
        it('should try to install the app on a device', function() {
            cli.argv(argv.concat(['install', 'android', '--device']));
            expect(phonegap.install.mostRecentCall.args[0]).toMatch({
                platforms: ['android'],
                device: true
            });
        });
    });
});
