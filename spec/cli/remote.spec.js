/*
 * Module dependencies.
 */

var CLI = require('../../lib/cli'),
    cli;

/*
 * Remote command specification.
 */

describe('$ phonegap remote', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
    });

    describe('$ phonegap help', function() {
        it('outputs info on the remote command', function() {
            cli.argv({ _: ['help'] });
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/Commands:[\w\W]*\s+remote \[command\]/i);
        });
    });

    describe('$ phonegap remote', function() {
        it('outputs the remote help dialog command', function() {
            cli.argv({ _: ['remote'] });
            expect(process.stdout.write.mostRecentCall.args[0])
                .toMatch(/usage: [\S]+ remote \[command\]/i);
        });
    });
});
