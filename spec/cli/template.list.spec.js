/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main');
var CLI = require('../../lib/cli');
var argv;
var cli;
var stdout;

/*
 * Specification: $ phonegap help template list
 */

describe('phonegap help template list', function () {
    beforeEach(function () {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help template', function () {
        it('should include the command', function () {
            cli.argv(argv.concat(['help', 'template']));
            expect(stdout.calls.mostRecent().args[0]).toMatch(/\r?\n\s+list.*\r?\n/i);
        });
    });

    describe('$ phonegap help template list', function () {
        it('should output usage info', function () {
            cli.argv(argv.concat(['help', 'template', 'list']));
            expect(stdout.calls.mostRecent().args[0]).toMatch(/usage: [\S]+ template list/i);
        });
    });

    describe('$ phonegap template list help', function () {
        it('should output usage info', function () {
            cli.argv(argv.concat(['template', 'list', 'help']));
            expect(stdout.calls.mostRecent().args[0]).toMatch(/usage: [\S]+ template list/i);
        });
    });

    describe('$ phonegap template list --help', function () {
        it('should output usage info', function () {
            cli.argv(argv.concat(['template', 'list', '--help']));
            expect(stdout.calls.mostRecent().args[0]).toMatch(/usage: [\S]+ template list/i);
        });
    });

    describe('$ phonegap template list -h', function () {
        it('should output usage info', function () {
            cli.argv(argv.concat(['template', 'list', '-h']));
            expect(stdout.calls.mostRecent().args[0]).toMatch(/usage: [\S]+ template list/i);
        });
    });
});

/*
 * Specification: $ phonegap template list
 */

describe('phonegap template list', function () {
    beforeEach(function () {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(phonegap.template, 'list');
        spyOn(phonegap, 'emit');
    });

    it('should call phonegap.template.list()', function () {
        cli.argv(argv.concat(['template', 'list']));
        expect(phonegap.template.list).toHaveBeenCalled();
    });

    it('should list each available template', function (done) {
        var templates = require('../../package.json').templates;
        phonegap.template.list.and.callThrough();
        cli.argv(argv.concat(['template', 'list']), function () {
            expect(phonegap.emit.calls.count()).toEqual(
                Object.keys(templates).length
            );
            done();
        });
    });
});
