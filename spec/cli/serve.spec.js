/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help serve
 */

describe('phonegap help serve', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap, 'serve');
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap serve help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['serve', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ serve/i);
        });
    });

    describe('$ phonegap serve --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['serve', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ serve/i);
        });
    });

    describe('$ phonegap serve -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['serve', '-h']));
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
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'serve').andReturn({
            on: function(){}
        });
    });

    describe('$ phonegap serve', function() {
        it('should connect to phonegap serve', function() {
            cli.argv(argv.concat(['serve']));
            expect(phonegap.serve).toHaveBeenCalled();
        });
    });

    describe('$ phonegap serve --port 1337', function() {
        it('should connect to phonegap serve on port 1337', function() {
            cli.argv(argv.concat(['serve', '--port', '1337']));
            expect(phonegap.serve).toHaveBeenCalled();
            expect(phonegap.serve.mostRecentCall.args[0]).toMatch({ port: 1337 });
        });
    });

    describe('$ phonegap serve -p 1337', function() {
        it('should connect to phonegap serve on port 1337', function() {
            cli.argv(argv.concat(['serve', '-p', '1337']));
            expect(phonegap.serve).toHaveBeenCalled();
            expect(phonegap.serve.mostRecentCall.args[0]).toMatch({ port: 1337 });
        });
    });
});
