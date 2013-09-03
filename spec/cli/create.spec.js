/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help create
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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+create <path>.*\r?\n/i);
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
 * Specification: $ phonegap create <path>
 */

describe('phonegap create <path>', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'create');
    });

    describe('$ phonegap create ./my-app', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'] });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app com.example.app', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app', 'com.example.app'] });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app com.example.app "My App"', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app', 'com.example.app', 'My App'] });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App'
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --id com.example.app', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'], id: 'com.example.app' });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -i com.example.app', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'], i: 'com.example.app' });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --name "My App"', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'], name: 'My App' });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: "My App"
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -n "My App"', function() {
        it('should try to create the project', function() {
            cli.argv({ _: ['create', './my-app'], n: 'My App' });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: "My App"
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --id com.example.app --name "My App"', function() {
        it('should try to create the project', function() {
            cli.argv({
                _: ['create', './my-app'],
                id: 'com.example.app',
                name: 'My App'
            });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App'
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -i com.example.app -n "My App"', function() {
        it('should try to create the project', function() {
            cli.argv({
                _: ['create', './my-app'],
                i: 'com.example.app',
                n: 'My App'
            });
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App'
            },
            jasmine.any(Function));
        });
    });
});
