/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote install
 */

describe('phonegap help remote install', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.remote, 'install');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'remote']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+install <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap remote install', function() {
        it('outputs usage info', function() {
            cli.argv(argv.concat(['remote', 'install']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote install/i);
        });
    });

    describe('$ phonegap help remote install', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'remote', 'install']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote install/i);
        });
    });

    describe('$ phonegap remote install help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'install', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote install/i);
        });
    });

    describe('$ phonegap remote install --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'install', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote install/i);
        });
    });

    describe('$ phonegap remote install -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'install', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote install/i);
        });
    });
});

/*
 * Specification: $ phonegap remote install <platform>
 */

describe('phonegap remote install <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(phonegap.remote, 'install');
    });

    describe('$ phonegap remote install android', function() {
        it('should try to install the app', function() {
            cli.argv(argv.concat(['remote', 'install', 'android']));
            expect(phonegap.remote.install).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful install', function() {
            beforeEach(function() {
                phonegap.remote.install.andCallFake(function(opts, callback) {
                    callback(null, {});
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv(argv.concat(['remote', 'install', 'android']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should call callback with a data object', function(done) {
                cli.argv(argv.concat(['remote', 'install', 'android']), function(e, data) {
                    expect(data).toEqual({});
                    done();
                });
            });
        });

        describe('failed install', function() {
            beforeEach(function() {
                phonegap.remote.install.andCallFake(function(opts, callback) {
                    callback(new Error('Could not connect to PhoneGap Build.'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv(argv.concat(['remote', 'install', 'android']), function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
