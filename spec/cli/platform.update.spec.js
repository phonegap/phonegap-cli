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
 * Specification: $ phonegap help platform update <platform>
 */

describe('phonegap help platform update', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.platform, 'update');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help platform', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'platform']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+update <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap platform update', function() {
        it('outputs usage info', function() {
            cli.argv(argv.concat(['platform', 'update']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform update/i);
        });
    });

    describe('$ phonegap help platform update', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'platform', 'update']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform update/i);
        });
    });

    describe('$ phonegap platform update help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['platform', 'update', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform update/i);
        });
    });

    describe('$ phonegap platform update --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['platform', 'update', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform update/i);
        });
    });

    describe('$ phonegap platform update -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['platform', 'update', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ platform update/i);
        });
    });
});

/*
 * Specification: $ phonegap platform update <platform>
 */

describe('phonegap platform update <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        emitterSpy = {
            on: function() {
                 // spy stub
            }
        };
        spyOn(process.stdout, 'write');
        spyOn(phonegap.platform, 'update').andReturn(emitterSpy);
    });

    describe('$ phonegap platform update android', function() {
        it('should try to update the platform', function() {
            cli.argv(argv.concat(['platform', 'update', 'android']));
            expect(phonegap.platform.update).toHaveBeenCalledWith(
                {
                    platforms: ['android']
                },
                jasmine.any(Function)
            );
        });

        describe('successful platform update', function() {
            beforeEach(function() {
                phonegap.platform.update.andCallFake(function(opts, callback) {
                    callback(null);
                    return emitterSpy;
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv(argv.concat(['platform', 'update', 'android']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed platform update', function() {
            beforeEach(function() {
                phonegap.platform.update.andCallFake(function(opts, callback) {
                    callback(new Error('write access denied'));
                    return emitterSpy;
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv(argv.concat(['platform', 'update', 'android']), function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
