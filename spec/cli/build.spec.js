/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help build
 */

describe('phonegap help build', function() {
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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+build <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap build', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['build']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap help build', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'build']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['build', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['build', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['build', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });
});

/*
 * Specification: $ phonegap build <platform>
 */

describe('phonegap build <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap, 'build');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap build android', function() {
        it('should try to build the project', function() {
            cli.argv(argv.concat(['build', 'android']));
            expect(phonegap.build).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful build', function() {
            beforeEach(function() {
                phonegap.build.andCallFake(function(options, callback) {
                    callback(null, {});
                });
            });

            it('should trigger callback without an error', function(done) {
                cli.argv(argv.concat(['build', 'android']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with data', function(done) {
                cli.argv(argv.concat(['build', 'android']), function(e, data) {
                    expect(data).toEqual(jasmine.any(Object));
                    done();
                });
            });
        });

        describe('failed build', function() {
            beforeEach(function() {
                phonegap.build.andCallFake(function(options, callback) {
                    callback(new Error('Ganon stole the binary!'));
                });
            });

            it('should trigger callback with an error', function(done) {
                cli.argv(argv.concat(['build', 'android']), function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
