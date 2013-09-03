/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help local run
 */

describe('phonegap help local run', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap.local, 'run');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help local', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'local'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+run <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap local run', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['local', 'run'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local run/i);
        });
    });

    describe('$ phonegap help local run', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'local', 'run'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local run/i);
        });
    });

    describe('$ phonegap local run help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'run', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local run/i);
        });
    });

    describe('$ phonegap local run --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'run'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local run/i);
        });
    });

    describe('$ phonegap local run -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'run'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local run/i);
        });
    });
});

/*
 * Specification: phonegap local run <platform>
 */

describe('phonegap local run <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.local, 'run');
    });

    describe('$ phonegap local run android', function() {
        it('should try to run the project', function() {
            cli.argv({ _: ['local', 'run', 'android'] });
            expect(phonegap.local.run).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful run', function() {
            beforeEach(function() {
                phonegap.local.run.andCallFake(function(opts, callback) {
                    callback(null, {});
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['local', 'run', 'android'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should call callback with a data object', function(done) {
                cli.argv({ _: ['local', 'run', 'android'] }, function(e, data) {
                    expect(data).toEqual({});
                    done();
                });
            });
        });

        describe('failed run', function() {
            beforeEach(function() {
                phonegap.local.run.andCallFake(function(opts, callback) {
                    callback(new Error('file I/O error'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['local', 'run', 'android'] }, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('$ phonegap local run --device android', function() {
        it('should try to run the project on a device', function() {
            cli.argv({ _: ['local', 'run', 'android'], device: true });
            expect(phonegap.local.run).toHaveBeenCalledWith(
                { platforms: ['android'], device: true },
                jasmine.any(Function)
            );
        });
    });
});
