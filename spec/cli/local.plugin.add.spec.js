/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help local plugin add
 */

describe('phonegap help local plugin add', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
        spyOn(phonegap.local.plugin, 'add');
    });

    describe('$ phonegap help local plugin', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'local', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+add <path>.*\r?\n/i);
        });
    });

    describe('$ phonegap local plugin add', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'add'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin add <path>/i);
        });
    });

    describe('$ phonegap help local plugin add', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'local', 'plugin', 'add'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin add <path>/i);
        });
    });

    describe('$ phonegap local plugin add help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'add', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin add <path>/i);
        });
    });

    describe('$ phonegap local plugin add --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'add'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin add <path>/i);
        });
    });

    describe('$ phonegap local plugin add -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'add'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin add <path>/i);
        });
    });
});

/*
 * Specification: $ phonegap local plugin add <path>
 */

describe('phonegap local plugin add <path>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.local.plugin, 'add');
    });

    describe('$ phonegap local plugin add /path/to/plugin', function() {
        it('should try to add the plugin', function() {
            cli.argv({ _: ['local', 'plugin', 'add', '/path/to/plugin'] });
            expect(phonegap.local.plugin.add).toHaveBeenCalledWith(
                {
                    path: ['/path/to/plugin']
                },
                jasmine.any(Function)
            );
        });

        describe('successfully add plugin', function() {
            beforeEach(function() {
                phonegap.local.plugin.add.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['local', 'plugin', 'add', '/path/to/plugin'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed plugin add', function() {
            beforeEach(function() {
                phonegap.local.plugin.add.andCallFake(function(options, callback) {
                    callback(new Error('write access denied'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['local', 'plugin', 'add', 'android'] }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
