/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help local plugin list
 */

describe('phonegap help local plugin list', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.local.plugin, 'list');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help local plugin', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help', 'local', 'plugin']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+list.*\r?\n/i);
        });
    });

    describe('$ phonegap help local plugin list', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'local', 'plugin', 'list']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin list/i);
        });
    });

    describe('$ phonegap local plugin list help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'plugin', 'list', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin list/i);
        });
    });

    describe('$ phonegap local plugin list --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'plugin', 'list', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin list/i);
        });
    });

    describe('$ phonegap local plugin list -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['local', 'plugin', 'list', '-h']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin list/i);
        });
    });
});

/*
 * Specification: $ phonegap local plugin list
 */

describe('phonegap local plugin list', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(phonegap.local.plugin, 'list');
    });

    describe('$ phonegap local plugin list', function() {
        it('should try to list the plugins', function() {
            cli.argv(argv.concat(['local', 'plugin', 'list']));
            expect(phonegap.local.plugin.list).toHaveBeenCalledWith(
                {},
                jasmine.any(Function)
            );
        });

        describe('successful plugin list', function() {
            beforeEach(function() {
                phonegap.local.plugin.list.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv(argv.concat(['local', 'plugin', 'list']), function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed plugin list', function() {
            beforeEach(function() {
                phonegap.local.plugin.list.andCallFake(function(options, callback) {
                    callback(new Error('write access denied'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv(argv.concat(['local', 'plugin', 'list']), function(e, data) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
