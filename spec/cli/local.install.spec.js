/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help local install
 */

describe('phonegap help local install', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap.local, 'install');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help local', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'local'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+install <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap local install', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['local', 'install'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local install/i);
        });
    });

    describe('$ phonegap help local install', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'local', 'install'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local install/i);
        });
    });

    describe('$ phonegap local install help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'install', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local install/i);
        });
    });

    describe('$ phonegap local install --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'install'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local install/i);
        });
    });

    describe('$ phonegap local install -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'install'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local install/i);
        });
    });
});

/*
 * Specification: phonegap local install <platform>
 */

describe('phonegap local install <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.local, 'install');
    });

    describe('$ phonegap local install android', function() {
        it('should try to install the app', function() {
            cli.argv({ _: ['local', 'install', 'android'] });
            expect(phonegap.local.install).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful install', function() {
            beforeEach(function() {
                phonegap.local.install.andCallFake(function(opts, callback) {
                    callback(null, {});
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['local', 'install', 'android'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should call callback with a data object', function(done) {
                cli.argv({ _: ['local', 'install', 'android'] }, function(e, data) {
                    expect(data).toEqual({});
                    done();
                });
            });
        });

        describe('failed install', function() {
            beforeEach(function() {
                phonegap.local.install.andCallFake(function(opts, callback) {
                    callback(new Error('file I/O error'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['local', 'install', 'android'] }, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('$ phonegap local install --device android', function() {
        it('should try to install the app', function() {
            cli.argv({ _: ['local', 'install', 'android'], device: true });
            expect(phonegap.local.install).toHaveBeenCalledWith(
                { platforms: ['android'], device: true },
                jasmine.any(Function)
            );
        });
    });
});
