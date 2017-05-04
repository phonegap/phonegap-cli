//ToDo: here!
var path = require('path'),
    fs = require('fs'),
    shell = require('shelljs'),
    EventEmitter = require('events').EventEmitter,
    mockery = require('mockery'),
    fn = require('../lib/phonegap/cordova-dependence').exec,
    processSpy = {
        stdout: new EventEmitter(),
        stderr: new EventEmitter()
    };

var tests = path.resolve(__dirname, 'testcases');


//Not a package should error
describe('phonegap cordova dependency tests', function() {
    var projectDir;

    it ('should error if project is not a project', function(done) {
        projectDir = path.resolve(tests, 'not_a_project');
        fn(projectDir)
        .then(function() {
            expect('fail').toBe('thrown');
        }).fail(function(err) {
            expect(err.message).toBe('"'+projectDir+'"' + ' does not point to a valid PhoneGap project');
        }).fin(done);
    });

    it('should error with no config.xml', function(done) {
        projectDir = path.resolve(tests, 'no_config');
        fn(projectDir)
        .then(function() {
            expect('fail').toBe('thrown');
        }).fail(function(err) {
            expect(err.message).toBe('"'+projectDir+'"' + ' does not point to a valid PhoneGap project');
        }).fin(done);
    });

    describe ('no package.json', function() {
        var emitter;

        beforeEach(function() {
            emitter = new EventEmitter();
            spyOn(fs, 'writeFileSync');
            spyOn(shell, 'which').andReturn(true);
            spyOn(shell, 'exec').andCallFake(function(command, options, callback) {
                callback(0, 'success');
                return processSpy;
            });
            spyOn(emitter, 'emit');
            mockery.enable({ useCleanCache : true});
            mockery.registerMock('../../spec/testcases/no_pkg_json/package.json', '../../spec/testcases/package.json');
            mockery.warnOnUnregistered(false);
        });

        afterEach(function() {
            mockery.resetCache();
            mockery.deregisterAll();
            mockery.disable();
        });

        it('should parse config.xml, create package.json, and use npm to install dependency', function(done) {
            projectDir = path.resolve(tests, 'no_pkg_json');
            fn(projectDir, emitter)
            .then(function() {
                expect(fs.writeFileSync).toHaveBeenCalledWith(projectDir+'/package.json', '{\n    "displayName": "NoPackageJson",\n    "name": "no.pkg.json",\n    "version": "2.0.0"\n}', 'utf8');
                expect(shell.exec).toHaveBeenCalled();
            }).fail(function(err) {
                expect(err).not.toBeDefined();
            }).fin(done);
        });
    });

    describe ('has package.json', function() {
        var emitter;
        beforeEach(function() {
            emitter = new EventEmitter();
            spyOn(fs, 'writeFileSync');
            spyOn(shell, 'which').andReturn(true);
            spyOn(shell, 'exec').andCallFake(function(command, options, callback) {
                callback(0, 'success');
                return processSpy;
            });
            spyOn(emitter, 'emit');
        });

        it('should do nothing if cordova dependency exists', function(done) {
            projectDir = path.resolve(tests, 'pkg_json_cordova');
            fn(projectDir, emitter)
            .then(function() {
                expect(fs.writeFileSync).not.toHaveBeenCalled();
                expect(shell.which).not.toHaveBeenCalled();
                expect(shell.exec).not.toHaveBeenCalled();
            }).fail(function(err) {
                expect(err).not.toBeDefined();
            }).fin(done);
        });

        it('should use npm to install dependency if not exists', function(done) {
            // Find the latest version of Cordova published and install it
            projectDir = path.resolve(tests, 'pkg_json_no_cordova');
            fn(projectDir, emitter)
            .then(function() {
                expect(fs.writeFileSync).not.toHaveBeenCalled();
                expect(shell.which).toHaveBeenCalled();
                expect(shell.exec).toHaveBeenCalled();
            }).fail(function(err) {
                expect(err).not.toBeDefined();
            }).fin(done);
        });
    });
});

