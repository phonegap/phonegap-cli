/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help plugin list
 */

describe('phonegap help plugin list', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap.plugin, 'list');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help plugin', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+list.*\r?\n/i);
        });
    });

    describe('$ phonegap help plugin list', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'plugin', 'list'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin list/i);
        });
    });

    describe('$ phonegap plugin list help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'list', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin list/i);
        });
    });

    describe('$ phonegap plugin list --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'list'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin list/i);
        });
    });

    describe('$ phonegap plugin list -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'list'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin list/i);
        });
    });
});

/*
 * Specification: $ phonegap plugin list
 */

describe('phonegap plugin list', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.plugin, 'list');
    });

    describe('$ phonegap plugin list', function() {
        it('should try to list the plugins', function() {
            cli.argv({ _: ['plugin', 'list'] });
            expect(phonegap.plugin.list).toHaveBeenCalledWith(
                {},
                jasmine.any(Function)
            );
        });

        describe('successful plugin list', function() {
            beforeEach(function() {
                phonegap.plugin.list.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['plugin', 'list'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed plugin list', function() {
            beforeEach(function() {
                phonegap.plugin.list.andCallFake(function(options, callback) {
                    callback(new Error('write access denied'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['plugin', 'list'] }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
