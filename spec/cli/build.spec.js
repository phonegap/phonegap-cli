/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help build.
 */

describe('phonegap help build', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+build <platform>.*\n/i);
        });
    });

    describe('$ phonegap build', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap help build', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'build'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });

    describe('$ phonegap build -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['build'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ build <platform>/i);
        });
    });
});

/*
 * Specification: phonegap build <platform>.
 */

describe('phonegap build <platform>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        //spyOn(cli.phonegap, 'build');
        spyOn(cli.remote, 'build');
    });

    describe('$ phonegap build android', function() {
        it('should try to build the android project', function() {
            cli.argv({ _: ['build', 'android'] });
            expect(cli.remote.build).toHaveBeenCalledWith(
                { _: ['remote', 'build', 'android'] },
                jasmine.any(Function)
            );
        });
    });
});
