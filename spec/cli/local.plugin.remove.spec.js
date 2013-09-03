/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help local plugin remove
 */

describe('phonegap help local plugin remove', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap.local.plugin, 'remove');
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help local plugin', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help', 'local', 'plugin'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+remove <id>.*\r?\n/i);
        });
    });

    describe('$ phonegap local plugin remove', function() {
        it('outputs usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'remove'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin remove <id>/i);
        });
    });

    describe('$ phonegap help local plugin remove', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'local', 'plugin', 'remove'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin remove <id>/i);
        });
    });

    describe('$ phonegap local plugin remove help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'remove', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin remove <id>/i);
        });
    });

    describe('$ phonegap local plugin remove --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'remove'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin remove <id>/i);
        });
    });

    describe('$ phonegap local plugin remove -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['local', 'plugin', 'remove'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ local plugin remove <id>/i);
        });
    });
});

/*
 * Specification: $ phonegap local plugin remove <id>
 */

describe('phonegap local plugin remove <id>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.local.plugin, 'remove');
    });

    describe('$ phonegap local plugin remove org.cordova.core.geolocation', function() {
        it('should try to remove the plugin', function() {
            cli.argv({ _: ['local', 'plugin', 'remove', 'org.cordova.core.geolocation'] });
            expect(phonegap.local.plugin.remove).toHaveBeenCalledWith(
                {
                    id: ['org.cordova.core.geolocation']
                },
                jasmine.any(Function)
            );
        });

        describe('successfully remove plugin', function() {
            beforeEach(function() {
                phonegap.local.plugin.remove.andCallFake(function(options, callback) {
                    callback(null);
                });
            });

            it('should call callback without an error', function(done) {
                cli.argv({ _: ['local', 'plugin', 'remove', 'org.cordova.core.geolocation'] }, function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed remove plugin', function() {
            beforeEach(function() {
                phonegap.local.plugin.remove.andCallFake(function(options, callback) {
                    callback(new Error('write access denied'));
                });
            });

            it('should call callback with an error', function(done) {
                cli.argv({ _: ['local', 'plugin', 'remove', 'org.cordova.core.geolocation'] }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
