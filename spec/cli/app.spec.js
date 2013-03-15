/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli;

/*
 * App command specification.
 */

describe('$ phonegap app', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(cli.phonegap, 'app').andReturn({
            on: function(){}
        });
    });

    describe('$ phonegap help', function() {
        it('outputs info on the help command', function() {
            cli.argv({ _: ['help'] });
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/Commands:[\w\W]*\s+app/i);
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
