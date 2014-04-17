/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help plugin remove
 */

describe('phonegap help plugin remove', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
        spyOn(process.stderr, 'write');
        spyOn(phonegap.plugin, 'remove');
    });

    describe('$ phonegap help plugin', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+remove <id>.*\r?\n/i);
        });
    });

    describe('$ phonegap plugin remove', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['plugin', 'remove'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin remove <id>/i);
        });
    });

    describe('$ phonegap help plugin remove', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'plugin', 'remove'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin remove <id>/i);
        });
    });

    describe('$ phonegap plugin remove help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'remove', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin remove <id>/i);
        });
    });

    describe('$ phonegap plugin remove --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'remove'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin remove <id>/i);
        });
    });

    describe('$ phonegap plugin remove -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['plugin', 'remove'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ plugin remove <id>/i);
        });
    });
});

/*
 * Specification: $ phonegap plugin remove <id>
 */

describe('phonegap plugin remove <id>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.plugin, 'remove');
    });

    describe('$ phonegap plugin remove plugin.id', function() {
        it('should try to remove the plugin', function() {
            cli.argv({ _: ['plugin', 'remove', 'plugin.id'] });
            expect(phonegap.plugin.remove).toHaveBeenCalledWith(
                {
                    id: ['plugin.id']
                },
                jasmine.any(Function)
            );
        });

        describe('successfully remove plugin', function() {
            beforeEach(function() {
                phonegap.plugin.remove.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['plugin', 'remove', 'plugin.id'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed plugin remove', function() {
            beforeEach(function() {
                phonegap.plugin.remove.andCallFake(function(options, callback) {
                    callback(new Error('write access denied'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['plugin', 'remove', 'plugin.id'] }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
