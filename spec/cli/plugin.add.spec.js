/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help plugin add
 */

describe('phonegap help plugin add', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
        spyOn(process.stderr, 'write');
        spyOn(phonegap.plugin, 'add');
    });

    describe('$ phonegap help plugin', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+add <path>.*\r?\n/i);
        });
    });

    describe('$ phonegap plugin add', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['plugin', 'add'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin add <path>/i);
        });
    });

    describe('$ phonegap help plugin add', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'plugin', 'add'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin add <path>/i);
        });
    });

    describe('$ phonegap plugin add help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'add', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin add <path>/i);
        });
    });

    describe('$ phonegap plugin add --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'add'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin add <path>/i);
        });
    });

    describe('$ phonegap plugin add -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'add'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin add <path>/i);
        });
    });
});

/*
 * Specification: $ phonegap plugin add <path>
 */

describe('phonegap plugin add <path>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.plugin, 'add');
    });

    describe('$ phonegap plugin add /path/to/plugin', function() {
        it('should try to add the plugin', function() {
            cli.argv({ _: ['plugin', 'add', '/path/to/plugin'] });
            expect(phonegap.plugin.add).toHaveBeenCalledWith(
                {
                    path: ['/path/to/plugin']
                },
                jasmine.any(Function)
            );
        });

        describe('successfully add plugin', function() {
            beforeEach(function() {
                phonegap.plugin.add.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['plugin', 'add', '/path/to/plugin'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed plugin add', function() {
            beforeEach(function() {
                phonegap.plugin.add.andCallFake(function(options, callback) {
                    callback(new Error('write access denied'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['plugin', 'add', 'android'] }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
