/**
 *  tests by @carynbear
 */

/*
 * Module dependencies.
 */

var PhoneGap = require('../lib/phonegap'),
    network = require('../lib/phonegap/util/network'),
    shell = require('shelljs'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    mockery = require('mockery'),
    Q = require('q'),
    phonegap,
    options,
    cordovaCreateSpy,
    TIMEOUT = 10000;

/*
 * Specification: phonegap.create(options, [callback])
 */
describe('"spec/phonegap/create.spec.js" phonegap.create calling cordova-create', function() {
    beforeEach(function() {
        cordovaCreateSpy = jasmine.createSpy("cordovaCreateSpy").andCallFake(function(){ 
            return Q();
        });
        cordovaDependencySpy = jasmine.createSpy("cordovaDependencySpy").andCallFake(function(){
            return Q();
        });
        mockery.enable({ useCleanCache:true });
        mockery.registerMock('cordova-create', cordovaCreateSpy);
        mockery.registerMock('phonegap-cordova-dependence', {exec : cordovaDependencySpy});
        mockery.warnOnUnregistered(false);
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(fs, 'writeFileSync').andCallFake(function(){});
        spyOn(fs, 'existsSync').andReturn(false); //If true, then will try to open pkg json which doesn't exist
    });

    afterEach(function(){
        this.removeAllSpies();
        mockery.resetCache();
        mockery.deregisterAll();
        mockery.disable(); 
    });

    it('should try to create a project with default values', function(done) {
        var cfg, wwwCfg;
        cfg = {};
        wwwCfg = {
            url: "phonegap-template-hello-world",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';
        phonegap.create(options, function(e) {
            expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should try to create a project with a given name and id', function(done) {
        var cfg, wwwCfg;
        cfg = {};
        wwwCfg = {
            url: "phonegap-template-hello-world",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        options.id = 'com.example.app';
        options.name = 'My App';
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';

        phonegap.create(options, function(e) {
            expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should try to create a project with a given config', function(done) {
        options.id = 'com.example.app';
        options.name = 'My App';
        options.config = { some: 'value' };
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';
        phonegap.create(options, function(e) {
            expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, options.config, jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should try to create a project with a template with a npm name', function(done) {
        var cfg, wwwCfg;
        
        options.template = 'phonegap-template-react-hot-loader';
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';
        cfg = {};
        wwwCfg = {
            url: options.template,
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;

        phonegap.create(options, function(e) {
            expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);


    it('should try to create a project with a template with a shortened name', function(done) {
        var cfg, wwwCfg;

        options.template = 'blank';
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';
        cfg = {};
        wwwCfg = {
            url: "phonegap-template-blank",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;

        phonegap.create(options, function(e) {
            expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);
        
    it('should create a default project when template name invalid', function(done) {
        var cfg, wwwCfg;

        options.template = true; // equivalent to --template
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';
        cfg = {};
        wwwCfg = {
            url: 'phonegap-template-hello-world',
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        phonegap.create(options, function(e) {
            expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });

    }, TIMEOUT);

    it('should trigger callback without an error', function(done) {
        options.path = '/some/other/path/to/app/www/'
        phonegap.create(options, function(e) {
            expect(cordovaDependencySpy).toHaveBeenCalled();
            expect(e).not.toBeDefined();
            done();
        });
    }, TIMEOUT);

});


/*
 * Specification: phonegap.create(options, [callback])
 */
describe('spec/phonegap/create.spec.js phonegap.create', function() {
    beforeEach(function() {
        this.removeAllSpies();
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(phonegap, 'version').andReturn({ phonegap: '2.8.0' });
        spyOn(network, 'isOnline').andCallFake(function(callback) {
            callback(false); // offline by default to speed up tests
        });
        spyOn(shell, 'rm');
        spyOn(shell, 'cp');
        spyOn(fs, 'renameSync');
        spyOn(fs, 'existsSync').andReturn(false);
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

    //describe('successfully created a project', function() {
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
         */
        
    //});


    it('should trigger callback with an error because cordova-create is not mocked', function(done) {
        phonegap.create(options, function(e) {
            expect(e).toBeDefined();
            done();
        });
    });

});