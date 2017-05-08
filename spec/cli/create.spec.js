/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    argv,
    cli,
    stdout;

/*
 * Specification: $ phonegap help create
 */

describe('phonegap help create', function() {
    beforeEach(function() {
        cli = new CLI();
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        stdout = process.stdout.write;
    });

    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv(argv.concat(['help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+create <path>.*\r?\n/i);
        });
    });

    describe('$ phonegap create', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['create']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap help create', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['help', 'create']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['create', 'help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create --help', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['create', '--help']));
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ create/i);
        });
    });

    describe('$ phonegap create -h', function() {
        it('should output usage info', function() {
            cli.argv(argv.concat(['create', '-h']));
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
        argv = ['node', '/usr/local/bin/phonegap'];
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'create');
    });

    describe('$ phonegap create ./my-app', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app com.example.app', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app', 'com.example.app']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app com.example.app "My App"', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app', 'com.example.app', 'My App']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App',
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app com.example.app "My App" "{ \\"lib\\": { \\"www\\": { \\"id\\": \\"com.example.app\\", \\"version\\": \\"1.0.0\\", \\"uri\\": \\"http://example.com/app.tar.gz\\" } } }"', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat([
                'create',
                './my-app',
                'com.example.app',
                'My App',
                '{ "lib": { "www": { "id": "com.example.app", "version": "1.0.0", "uri": "http://example.com/app.tar.gz" } } }'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App',
                config: {
                    lib: {
                        www: {
                            id: 'com.example.app',
                            version: '1.0.0',
                            uri: 'http://example.com/app.tar.gz'
                        }
                    }
                },
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --id com.example.app', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app', '--id', 'com.example.app']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -i com.example.app', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app', '-i', 'com.example.app']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --name "My App"', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app', '--name', 'My App']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: 'My App',
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -n "My App"', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat(['create', './my-app', '-n', 'My App']));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: 'My App',
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --id com.example.app --name "My App"', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '--id', 'com.example.app',
                '--name', 'My App'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App',
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -i com.example.app -n "My App"', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '-i', 'com.example.app',
                '-n', 'My App'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: 'com.example.app',
                name: 'My App',
                config: {},
                'copy-from': undefined,
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --copy-from http://example.com/app.tar.gz', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '--copy-from', 'http://example.com/app.tar.gz'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined,
                config: {},
                'copy-from': 'http://example.com/app.tar.gz',
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app -src http://example.com/app.tar.gz', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '-src', 'http://example.com/app.tar.gz'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined,
                config: {},
                'copy-from': 'http://example.com/app.tar.gz',
                'link-to': undefined
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --link-to path/to/an-app', function() {
        it('should try to create the project', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '--link-to', 'path/to/an-app'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': 'path/to/an-app'
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --template hello-world', function() {
        it('should try to create the project with template', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '--template', 'hello-world'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': undefined,
                template: 'hello-world'
            },
            jasmine.any(Function));
        });
    });

    describe('$ phonegap create ./my-app --recipe hello-world', function() {
        it('should try to create the project with template', function() {
            cli.argv(argv.concat([
                'create', './my-app',
                '--recipe', 'hello-world'
            ]));
            expect(phonegap.create).toHaveBeenCalledWith({
                path: './my-app',
                id: undefined,
                name: undefined,
                config: {},
                'copy-from': undefined,
                'link-to': undefined,
                template: 'hello-world'
            },
            jasmine.any(Function));
        });
    });
});
