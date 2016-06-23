/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote run
 */

describe('phonegap help remote run', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.remote, 'run');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'remote']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+run <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap remote run', function() {
        it('outputs usage info', function() {
            cli.argv(argv.concat(['remote', 'run']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote run/i);
        });
    });

    describe('$ phonegap help remote run', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'remote', 'run']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote run/i);
        });
    });

    describe('$ phonegap remote run help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'run', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote run/i);
        });
    });

    describe('$ phonegap remote run --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'run', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote run/i);
        });
    });

    describe('$ phonegap remote run -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['remote', 'run', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote run/i);
        });
    });
});

/*
 * Specification: $ phonegap remote run <platform>
 */

describe('phonegap remote run <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(phonegap.remote, 'run');
    });

    describe('$ phonegap remote run android', function() {
        it('should try to run the project', function() {
            cli.argv(argv.concat(['remote', 'run', 'android']));
            expect(phonegap.remote.run).toHaveBeenCalledWith(
                jasmine.objectContaining({ platforms: ['android'] }),
                jasmine.any(Function)
            );
        });

        describe('successful run', function() {
            beforeEach(function() {
                phonegap.remote.run.andCallFake(function(opts, callback) {
                    callback(null, {});
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv(argv.concat(['remote', 'run', 'android']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should call callback with a data object', function(done) {
                cli.argv(argv.concat(['remote', 'run', 'android']), function(e, data) {
                    expect(data).toEqual({});
                    done();
                });
            });
        });

        describe('failed run', function() {
            beforeEach(function() {
                phonegap.remote.run.andCallFake(function(opts, callback) {
                    callback(new Error('Could not connect to PhoneGap Build.'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv(argv.concat(['remote', 'run', 'android']), function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
