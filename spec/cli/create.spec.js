/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: phonegap help create.
 */

describe('phonegap help create', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\n\s+create <path>.*\n/i);
        });
    });

    describe('$ phonegap create', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['create'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap help create', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'create'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['create', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['create'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['create'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });
});

/*
 * Specification: phonegap create <path>.
 */

describe('phonegap create <path>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(cli.phonegap, 'create');
    });

    describe('$ phonegap create ./my-app', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'] });
            expect(cli.phonegap.create).toHaveBeenCalledWith({
                path: './my-app'
            },
            jasmine.any(Function));
        });
    });
});
