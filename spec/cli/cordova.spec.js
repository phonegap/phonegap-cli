/*!
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*!
 * Specification: $ phonegap cordova <command>
 */

describe('$ phonegap cordova', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    it('should bypass the PhoneGap CLI chain', function(done) {
        var version = require('../../node_modules/cordova/package.json').version;
        phonegap.on('raw', function(data) {
            expect(data).toMatch(version);
            done();
        });
        cli.argv(argv.concat(['cordova', '--version']));
    });

    describe('reconstructing the original command:', function() {
        beforeEach(function() {
            spyOn(phonegap, 'cordova');
        });

        it('$ phonegap build ios --release', function() {
            cli.argv(argv.concat(['cordova', 'build', 'ios', '--release']));
            expect(phonegap.cordova).toHaveBeenCalledWith(
                {
                    cmd: 'cordova build ios --release',
                    verbose: false
                },
                jasmine.any(Function)
            );
        });

        it('$ phonegap cordova create my-app --name "Hello World"', function() {
            cli.argv(argv.concat(['cordova', 'create', 'my-app', '--name', 'Hello World']));
            expect(phonegap.cordova).toHaveBeenCalledWith(
                {
                    cmd: 'cordova create my-app --name "Hello World"',
                    verbose: false
                },
                jasmine.any(Function)
            );
        });
    });

    describe('argument mapping', function() {
        beforeEach(function() {
            spyOn(phonegap, 'cordova');
        });

        it('should map -e to --emulator', function() {
            cli.argv(argv.concat(['cordova', 'run', 'ios', '-e']));
            expect(phonegap.cordova).toHaveBeenCalledWith(
                {
                    cmd: 'cordova run ios --emulator',
                    verbose: false
                },
                jasmine.any(Function)
            );
        });
    });
});
