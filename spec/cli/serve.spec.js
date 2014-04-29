/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help serve
 */

describe('phonegap help serve', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(phonegap, 'serve');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap serve help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['serve', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ serve/i);
        });
    });

    describe('$ phonegap serve --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['serve'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ serve/i);
        });
    });

    describe('$ phonegap serve -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['serve'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ serve/i);
        });
    });
});

/*
 * Specification: $ phonegap serve
 */

describe('phonegap serve', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'serve').andReturn({
            on: function(){}
        });
    });

    describe('$ phonegap serve', function() {
        it('should connect to phonegap serve', function() {
            cli.argv({ _: ['serve'] });
            expect(phonegap.serve).toHaveBeenCalled();
        });
    });

    describe('$ phonegap serve --port 1337', function() {
        it('should connect to phonegap serve on port 1337', function() {
            cli.argv({ _: ['serve'], port: 1337 });
            expect(phonegap.serve).toHaveBeenCalled();
            expect(phonegap.serve.mostRecentCall.args[0]).toEqual({ port: 1337 });
        });
    });

    describe('$ phonegap serve -p 1337', function() {
        it('should connect to phonegap serve on port 1337', function() {
            cli.argv({ _: ['serve'], p: 1337 });
            expect(phonegap.serve).toHaveBeenCalled();
            expect(phonegap.serve.mostRecentCall.args[0]).toEqual({ port: 1337 });
        });
    });

    describe('$ phonegap serve --autoreload', function() {
        it('should enable autoreload', function() {
            cli.argv({ _: ['serve'], autoreload: true });
            expect(phonegap.serve).toHaveBeenCalled();
            expect(phonegap.serve.mostRecentCall.args[0]).toEqual({ autoreload: true });
        });
    });

    describe('$ phonegap serve --no-autoreload', function() {
        it('should disable autoreload', function() {
            cli.argv({ _: ['serve'], autoreload: false });
            expect(phonegap.serve).toHaveBeenCalled();
            expect(phonegap.serve.mostRecentCall.args[0]).toEqual({ autoreload: false });
        });
    });
});
