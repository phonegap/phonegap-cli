/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help run
 */

describe('phonegap help run', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+run <platform>.*\r?\n/i);
        });
    });

    describe('$ phonegap run', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['run'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ run <platform>/i);
        });
    });

    describe('$ phonegap help run', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'run'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ run <platform>/i);
        });
    });

    describe('$ phonegap run help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['run', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ run <platform>/i);
        });
    });

    describe('$ phonegap run --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['run'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ run <platform>/i);
        });
    });

    describe('$ phonegap run -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['run'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ run <platform>/i);
        });
    });
});

/*
 * Specification: phonegap run <platform>
 */

describe('phonegap run <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap, 'run');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap run android', function() {
        it('should try to run the project', function() {
            cli.argv({ _: ['run', 'android'] });
            expect(phonegap.run).toHaveBeenCalledWith(
                { platforms: ['android'] },
                jasmine.any(Function)
            );
        });

        describe('successful run', function() {
            beforeEach(function() {
                phonegap.run.andCallFake(function(options, callback) {
                    callback(null, {});
                });
            });

            it('should trigger callback without an error', function(done) {
                cli.argv({ _: ['run', 'android'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with data', function(done) {
                cli.argv({ _: ['run', 'android'] }, function(e, data) {
                    expect(data).toEqual(jasmine.any(Object));
                    done();
                });
            });
        });

        describe('failed run', function() {
            beforeEach(function() {
                phonegap.run.andCallFake(function(options, callback) {
                    callback(new Error('server did not respond'));
                });
            });

            it('should trigger callback with an error', function(done) {
                cli.argv({ _: ['run', 'android'] }, function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });

    describe('$ phonegap run --device android', function() {
        it('should try to run the project', function() {
            cli.argv({ _: ['run', 'android'], device: true });
            expect(phonegap.run).toHaveBeenCalledWith(
                { platforms: ['android'], device: true },
                jasmine.any(Function)
            );
        });
    });
});
