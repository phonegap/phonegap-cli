var path = require('path'),
    fs,
    shell,
    path,
    fn,
    EventEmitter = require('events').EventEmitter,
    mockery = require('mockery'),
    processSpy = {
        stdout: new EventEmitter(),
        stderr: new EventEmitter()
    };

describe('Management of Cordova as an npm dependency', function() {
    var config_parser_spy,
        find_project_root_spy;
    beforeEach(function() {
        config_parser_spy = jasmine.createSpy('ConfigParserSpy');
        find_project_root_spy = jasmine.createSpy('findProjectRootSpy');
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });
        mockery.registerMock('cordova-common', {
            ConfigParser: config_parser_spy,
            CordovaCheck: {
                findProjectRoot: find_project_root_spy
            }
        });
        fn = require('../lib/phonegap/cordova-dependence').exec;
        shell = require('shelljs');
        fs = require('fs');
        path = require('path');
    });
    afterEach(function() {
        mockery.deregisterAll();
        mockery.disable();
    });

    it ('should error if project is not a valid cordova/phonegap project', function(done) {
        find_project_root_spy.andReturn(false);
        fn('my/sweet/project/path')
        .then(function() {
            expect('fail').toBe('thrown');
        }).fail(function(err) {
            expect(err.message).toContain('does not point to a valid PhoneGap project');
        }).fin(done);
    });

    describe ('in a project with no package.json', function() {
        var emitter;

        beforeEach(function() {
            find_project_root_spy.andReturn('/very/legit/project/directory');
            spyOn(shell, 'cd');
            emitter = new EventEmitter();
            config_parser_spy.andCallFake(function(path) {
                this.name = function() { return 'name'; };
                this.packageName = function() { return 'package_name'; };
                this.id = function() { return 'id'; };
                this.version = function() { return 'version'; };
            });
            spyOn(fs, 'writeFileSync');
            spyOn(fs, 'existsSync').andReturn(false);
            spyOn(emitter, 'emit');
            // this will define the package.json path that cordova-dependence will try to require
            // need to mock this so we can control `require`
            spyOn(path, 'relative').andReturn('my-package');
            mockery.registerMock('my-package', {
                dependencies: {
                    cordova: "winnar"
                }
            });
        });

        it('should parse config.xml and create a package.json based on config.xml values', function(done) {
            fn('/some/random/directory', emitter)
            .then(function() {
                expect(emitter.emit).toHaveBeenCalledWith('warn', 'No package.json was found for your project. Creating one from config.xml');
                console.log();
                expect(path.basename(fs.writeFileSync.mostRecentCall.args[0])).toEqual('package.json');
                expect(fs.writeFileSync.mostRecentCall.args[1]).toEqual('{\n    "displayName": "name",\n    "name": "package_name",\n    "version": "version"\n}');
                expect(fs.writeFileSync.mostRecentCall.args[2]).toEqual('utf8');
            }).fail(function(err) {
                console.log(err);
                expect(err).not.toBeDefined();
            }).fin(done);
        });

        describe('cordova installation', function() {
            beforeEach(function() {
                mockery.deregisterMock('my-package');
                mockery.registerMock('my-package', {});
            });
            it('should fail if npm could not be found', function(done) {
                spyOn(shell, 'which').andReturn(false);
                fn('/some/random/directory', emitter)
                .then(function() {
                    expect('fail').toBe('thrown');
                }).fail(function(err) {
                    expect(err.message).toContain('"npm" command line tool is not installed');
                }).fin(done);
            });
            describe('npm shell out', function() {
                it('should return promise resolution on success', function(done) {
                    spyOn(shell, 'which').andReturn(true);
                    spyOn(shell, 'exec').andCallFake(function(cmd, opts, cb) {
                        cb(0, 'stdout', 'stderr');
                        return processSpy;
                    });
                    fn('/some/random/directory', emitter)
                    .then(function() {
                        expect(shell.exec.mostRecentCall.args[0]).toEqual('npm install cordova --save');
                    }).fail(function(err) {
                        console.log(err);
                        expect(err).not.toBeDefined();
                    }).fin(done);
                });
                it('should return promise rejection on failure', function(done) {
                    spyOn(shell, 'which').andReturn(true);
                    spyOn(shell, 'exec').andCallFake(function(cmd, opts, cb) {
                        cb(1, 'stdout', 'stderr');
                        return processSpy;
                    });
                    fn('/some/random/directory', emitter)
                    .then(function() {
                        expect('fail').toBe('thrown');
                    }).fail(function(err) {
                        expect(err.exitCode).toEqual(1);
                        expect(err.message).toContain('Error from npm');
                    }).fin(done);
                });
            });
        });
    });

    describe('in a project with package.json', function() {
        var emitter;
        beforeEach(function() {
            find_project_root_spy.andReturn('/very/legit/project/directory');
            spyOn(shell, 'cd');
            emitter = new EventEmitter();
            spyOn(fs, 'existsSync').andReturn(true);
            spyOn(shell, 'which').andReturn(true);
            spyOn(shell, 'exec').andCallFake(function(command, options, callback) {
                callback(0, 'success');
                return processSpy;
            });
            spyOn(emitter, 'emit');
            // this will define the package.json path that cordova-dependence will try to require
            // need to mock this so we can control `require`
            spyOn(path, 'relative').andReturn('my-package');
        });

        it('should do nothing if cordova dependency exists', function(done) {
            mockery.registerMock('my-package', {
                dependencies: {
                    cordova: "winnar"
                }
            });
            fn('wtfjs', emitter)
            .then(function() {
                expect(shell.which).not.toHaveBeenCalled();
                expect(shell.exec).not.toHaveBeenCalled();
            }).fail(function(err) {
                console.log(err);
                expect(err).not.toBeDefined();
            }).fin(done);
        });

        it('should use npm to install dependency if it does not exist in package.json', function(done) {
            mockery.registerMock('my-package', {});
            fn('i love rock and roll', emitter)
            .then(function() {
                expect(shell.which).toHaveBeenCalled();
                expect(shell.exec.mostRecentCall.args[0]).toEqual('npm install cordova --save');
            }).fail(function(err) {
                console.log(err);
                expect(err).not.toBeDefined();
            }).fin(done);
        });
    });
});

