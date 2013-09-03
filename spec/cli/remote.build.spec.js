/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help remote build
 */

describe('phonegap help remote build', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap.remote, 'build');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help remote', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'remote'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+build <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap remote build', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['remote', 'build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap help remote build', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'remote', 'build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap remote build help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'build', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap remote build --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'build'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });

    describe('$ phonegap remote build -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['remote', 'build'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ remote build/i);
        });
    });
});

/*
 * Specification: $ phonegap remote build <platform>
 */

describe('phonegap remote build <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.remote, 'build');
    });

    describe('$ phonegap remote build android', function() {
        it('should try to build the project', function() {
            cli.argv({ _: ['remote', 'build', 'android'] });
            expect(phonegap.remote.build).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful project build', function() {
            beforeEach(function() {
                phonegap.remote.build.andCallFake(function(opts, callback) {
                    callback(null, {});
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['remote', 'build', 'android'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should call callback with a data object', function(done) {
                cli.argv({ _: ['remote', 'build', 'android'] }, function(e, data) {
                    expect(data).toEqual({});
                    done();
                });
            });
        });

        describe('failed project build', function() {
            beforeEach(function() {
                phonegap.remote.build.andCallFake(function(opts, callback) {
                    callback(new Error('Could not connect to PhoneGap Build.'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['remote', 'build', 'android'] }, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
