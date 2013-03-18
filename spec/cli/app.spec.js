/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help app.
 */

describe('phonegap help app', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/Commands:[\w\W]*\s+app/i);
        });
    });

    describe('$ phonegap help app', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'app'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });

    describe('$ phonegap app help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['app', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });

    describe('$ phonegap app --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['app'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });

    describe('$ phonegap app -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['app'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ app/i);
        });
    });
});

/*
 * Specification: phonegap app.
 */

describe('phonegap app', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(cli.phonegap, 'app').andReturn({
            on: function(){}
        });
    });

    describe('$ phonegap app', function() {
        it('should connect to phonegap app', function() {
            cli.argv({ _: ['app'] });
            expect(cli.phonegap.app).toHaveBeenCalledWith({});
        });
    });

    describe('$ phonegap app --port 1337', function() {
        it('should connect to phonegap app on port 1337', function() {
            cli.argv({ _: ['app'], port: 1337 });
            expect(cli.phonegap.app).toHaveBeenCalledWith({ port: 1337 });
        });
    });

    describe('$ phonegap app -p 1337', function() {
        it('should connect to phonegap app on port 1337', function() {
            cli.argv({ _: ['app'], p: 1337 });
            expect(cli.phonegap.app).toHaveBeenCalledWith({ port: 1337 });
        });
    });
});
