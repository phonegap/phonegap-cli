/**
 *  tests by @carynbear
 */

/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    network = require('../../lib/phonegap/util/network'),
    shell = require('shelljs'),
    fs = require('fs'),
    mockery = require('mockery'),
    Q = require('q'),
    phonegap,
    options,
    TIMEOUT = 10000;

/*
 * Specification: phonegap.create(options, [callback])
 */
describe('"spec/phonegap/create.spec.js" phonegap.create calling cordova-create', function() {
    var createArgs = [];
    beforeEach(function() {
        cordovaDependencySpy = jasmine.createSpy("cordovaDependencySpy").andCallFake(function() {
            return Q();
        });
        mockery.enable({ useCleanCache:true });
        mockery.registerMock('cordova-create', function(a, b, c, d, e) {
            createArgs.push(a,b,c,d,e);
            return Q();
        });
        mockery.registerMock('./cordova-dependence', {exec : cordovaDependencySpy});
        mockery.warnOnUnregistered(false);
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(fs, 'writeFileSync').andReturn(true);
        spyOn(fs, 'existsSync').andReturn(false); //If true, then will try to open pkg json which doesn't exist
    });

    afterEach(function() {
        createArgs = [];
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
        name = options.name || 'helloworld';
        id = options.id || 'com.phonegap.helloworld';
        phonegap.create(options, function(e) {
            expect(createArgs[0]).toEqual(options.path);
            expect(createArgs[1]).toEqual(id);
            expect(createArgs[2]).toEqual(name);
            expect(createArgs[3]).toEqual(cfg);
            expect(createArgs[4]).toEqual(jasmine.any(Object));
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
        name = options.name || 'helloworld';
        id = options.id || 'com.phonegap.helloworld';

        phonegap.create(options, function(e) {
            expect(createArgs[0]).toEqual(options.path);
            expect(createArgs[1]).toEqual(id);
            expect(createArgs[2]).toEqual(name);
            expect(createArgs[3]).toEqual(cfg);
            expect(createArgs[4]).toEqual(jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should try to create a project with a given config', function(done) {
        options.id = 'com.example.app';
        options.name = 'My App';
        options.config = { some: 'value' };
        name = options.name || 'helloworld';
        id = options.id || 'com.phonegap.helloworld';
        phonegap.create(options, function(e) {
            expect(createArgs[0]).toEqual(options.path);
            expect(createArgs[1]).toEqual(id);
            expect(createArgs[2]).toEqual(name);
            expect(createArgs[3]).toEqual(options.config);
            expect(createArgs[4]).toEqual(jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should try to create a project with a template with a npm name', function(done) {
        var cfg, wwwCfg;

        options.template = 'phonegap-template-react-hot-loader';
        name = options.name || 'helloworld';
        id = options.id || 'com.phonegap.helloworld';
        cfg = {};
        wwwCfg = {
            url: options.template,
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;

        phonegap.create(options, function(e) {
            expect(createArgs[0]).toEqual(options.path);
            expect(createArgs[1]).toEqual(id);
            expect(createArgs[2]).toEqual(name);
            expect(createArgs[3]).toEqual(cfg);
            expect(createArgs[4]).toEqual(jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);


    it('should try to create a project with a template with a shortened name', function(done) {
        var cfg, wwwCfg;

        options.template = 'blank';
        name = options.name || 'helloworld';
        id = options.id || 'com.phonegap.helloworld';
        cfg = {};
        wwwCfg = {
            url: "phonegap-template-blank",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;

        phonegap.create(options, function(e) {
            expect(createArgs[0]).toEqual(options.path);
            expect(createArgs[1]).toEqual(id);
            expect(createArgs[2]).toEqual(name);
            expect(createArgs[3]).toEqual(cfg);
            expect(createArgs[4]).toEqual(jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should create a default project when template name invalid', function(done) {
        var cfg, wwwCfg;

        options.template = true; // equivalent to --template
        name = options.name || 'helloworld';
        id = options.id || 'com.phonegap.helloworld';
        cfg = {};
        wwwCfg = {
            url: 'phonegap-template-hello-world',
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        phonegap.create(options, function(e) {
            expect(createArgs[0]).toEqual(options.path);
            expect(createArgs[1]).toEqual(id);
            expect(createArgs[2]).toEqual(name);
            expect(createArgs[3]).toEqual(cfg);
            expect(createArgs[4]).toEqual(jasmine.any(Object));
            expect(cordovaDependencySpy).toHaveBeenCalled();
            done();
        });
    }, TIMEOUT);

    it('should trigger callback without an error', function(done) {
        options.path = '/some/other/path/to/app/www/';
        phonegap.create(options, function(e) {
            expect(cordovaDependencySpy).toHaveBeenCalled();
            expect(e).not.toBeDefined();
            done();
        });
    }, TIMEOUT);

    it('should accept a numeric path', function(done) {
        options.path = 123;
        phonegap.create(options, function(e) {
            expect(e).toBeUndefined();
            done();
        });
    });

    it('should not require callback', function(done) {
        phonegap.create(options, function(e) {
            expect(e).toBeUndefined();
            done();
        });
    });

    it('should return itself', function(done) {
        expect(phonegap.create(options, function(e) {
            expect(e).toBeUndefined();
            done();
        })).toEqual(phonegap);
    });
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
        spyOn(shell, 'cp').andReturn(true);;
        spyOn(fs, 'renameSync');
        spyOn(fs, 'existsSync').andReturn(false);
        spyOn(fs, 'statSync').andReturn({
            isDirectory: function() { return false; } // template is not cached
        });
        spyOn(process.stderr, 'write');
    });

    afterEach(function() {
        this.removeAllSpies();
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.create(options);
        }).toThrow();
    });

    it('should require options.path', function() {
        expect(function() {
            options.path = undefined;
            phonegap.create(options);
        }).toThrow();
    });
});
