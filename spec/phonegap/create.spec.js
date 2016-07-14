/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('../../lib/cordova').cordova,
    cordovaLib = require('../../lib/cordova').lib,
    network = require('../../lib/phonegap/util/network'),
    shell = require('shelljs'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    phonegap,
    options,
    configParserSpy;

/*
 * Specification: phonegap.create(options, [callback])
 */

describe('phonegap.create(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            path: path.resolve('spec', 'fixture', 'app-with-config', 'www')
        };
        configParserSpy = {
            setPackageName: jasmine.createSpy(),
            setName: jasmine.createSpy(),
            write: jasmine.createSpy()
        };
        spyOn(phonegap, 'version').andReturn({ phonegap: '2.8.0' });
        spyOn(phonegap, 'cordova');
        spyOn(network, 'isOnline').andCallFake(function(callback) {
            callback(false); // offline by default to speed up tests
        });
        spyOn(cordova, 'config');
        spyOn(cordovaLib, 'configparser').andReturn(configParserSpy);
        spyOn(shell, 'rm');
        spyOn(shell, 'cp');
        spyOn(fs, 'renameSync');
        spyOn(fs, 'existsSync');
        spyOn(fs, 'statSync').andReturn({
            isDirectory: function() { return false; } // template is not cached
        });

        spyOn(process.stderr, 'write');
    });

    afterEach(function(){
        this.removeAllSpies();
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.create(options, function(e) {});
        }).toThrow();
    });

    it('should require options.path', function() {
        expect(function() {
            options.path = undefined;
            phonegap.create(options, function(e) {});
        }).toThrow();
    });

    it('should accept a numeric path', function() {
        expect(function() {
            options.path = 123;
            phonegap.create(options, function(e) {});
        }).not.toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.create(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.create(options)).toEqual(phonegap);
    });

        /* Removed following tests:
        ** Config.xml is handled by Cordova Create
        ** link-to has been deprecated
        ** callback test moved to ../prespec/create.spec.js
        'when my-app/www/config.xml exists should move it to my-app/config.xml'
        'when my-app/www/config.xml does not exist should not move it to my-app/config.xml'       
        'when updating config.xml should parse the my-app/config.xml'
        'when config.xml does not exist should trigger a "warn" event'
        'when --link-to is provided should not move config.xml should not update config.xml'
        'when complete should trigger callback without an error'
        
    describe('failed to create a project', function() {
        beforeEach(function() {
            phonegap.cordova.andCallFake(function(options, callback) {
                callback(new Error('path already exists'));
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegap.create(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });
    });
});

describe('phonegap create end to end: ', function(){
    beforeEach(function(){
        //create tmp folder
    });

    afterEach(function(){
        //delete tmp folder
    });


    describe('package json exists', function(){
        xit('should not create package.json' function(){
            //code here to call create
        });
        xit('should have the latest production cordova dependency', function(){

        });
    });

    describe('package json does not exist', function(){
        xit('should warn and create package.json', function(){
            //code here to call create
        });
        xit('should have correct name, version, author, description as in config.xml', function(){

        });
        xit('should have the latest production cordova dependency', function(){

        });

    });

});

function tmpDir (subdir) {
    var dir = path.join(os.tmpdir(), 'e2e-test');
    if (subdir) {
        dir = path.join(dir, subdir);
    }
    if(fs.existsSync(dir)) {
        shell.rm('-rf', dir);
    }
    shell.mkdir('-p', dir);
    return dir;
};
