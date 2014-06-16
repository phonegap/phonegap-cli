/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout,
    emitterSpy;

/*
 * Specification: $ phonegap help local build
 */

describe('phonegap help local build', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.local, 'build');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help local', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'local']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+build <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap local build', function() {
        it('outputs usage info', function() {
            cli.argv(argv.concat(['local', 'build']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local build/i);
        });
    });

    describe('$ phonegap help local build', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'local', 'build']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local build/i);
        });
    });

    describe('$ phonegap local build help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'build', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local build/i);
        });
    });

    describe('$ phonegap local build --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'build', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local build/i);
        });
    });

    describe('$ phonegap local build -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'build', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local build/i);
        });
    });
});

/*
 * Specification: $ phonegap local build <platform>
 */

describe('phonegap local build <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        emitterSpy = {
            on: function() {
                 // spy stub
            }
        };
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        spyOn(phonegap.local, 'build').andReturn(emitterSpy);
    });

    describe('$ phonegap local build android', function() {
        it('should try to build the project', function() {
            cli.argv(argv.concat(['local', 'build', 'android']));
            expect(phonegap.local.build).toHaveBeenCalledWith(
                {
                    platforms: ['android']
                },
                jasmine.any(Function)
            );
        });

        describe('successful project build', function() {
            beforeEach(function() {
                phonegap.local.build.andCallFake(function(opts, callback) {
                    callback(null);
                    return emitterSpy;
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv(argv.concat(['local', 'build', 'android']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed project build', function() {
            beforeEach(function() {
                phonegap.local.build.andCallFake(function(opts, callback) {
                    callback(new Error('write access denied'));
                    return emitterSpy;
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv(argv.concat(['local', 'build', 'android']), function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
