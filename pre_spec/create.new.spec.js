/*
 * Module dependencies.
 */
var PhoneGap = require('../lib/phonegap'),
    cordova = require('../lib/cordova').cordova,
    cordovaLib = require('../lib/cordova').lib,
    network = require('../lib/phonegap/util/network'),
    shell = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    mockery = require('mockery'),
    Q = require('q'),
    phonegap,
    options,
    configParserSpy,
    cordovaCreateSpy = jasmine.createSpy("cordovaCreateSpy").andCallFake(function(){ 
        console.log("Called Fake");
        return Q(); 
    });

/*
 * Specification: phonegap.create(options, [callback])
 */

describe('create.new.spec.js "phonegap.create"', function() {
    beforeEach(function() {
        mockery.enable();
        mockery.registerMock('cordova-create', cordovaCreateSpy);
        mockery.warnOnUnregistered(false);
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };
    });

    afterEach(function(){
        mockery.deregisterMock('cordova-create');
        mockery.disable();
    });

    it('should try to create a project with default values', function() {
        var cfg = {};
        var wwwCfg = {
            url: "phonegap-template-hello-world",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        phonegap.create(options);
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, cfg, jasmine.any(Object));
    });

    it('should try to create a project with a given name and id', function() {
        var cfg = {};
        var wwwCfg = {
            url: "phonegap-template-hello-world",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        options.id = 'com.example.app';
        options.name = 'My App';
        phonegap.create(options);
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, cfg, jasmine.any(Object));
    });

    it('should try to create a project with a given config', function() {
        options.id = 'com.example.app';
        options.name = 'My App';
        options.config = { some: 'value' };
        phonegap.create(options);
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, options.config, jasmine.any(Object));
    });

    it('should try to create a project with a template with a npm name', function() {
        options.template = 'phonegap-template-react-hot-loader';
        phonegap.create(options);
        var cfg = {};
        var wwwCfg = {
            url: options.template,
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, cfg, jasmine.any(Object));
    });


    it('should try to create a project with a template with a shortened name', function() {
        options.template = 'blank';
        phonegap.create(options);
        var cfg = {};
        var wwwCfg = {
            url: "phonegap-template-blank",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, cfg, jasmine.any(Object));
    });
        
    it('should create a default project when template name invalid', function() {
        options.template = true; // equivalent to --template
        phonegap.create(options);
        var cfg = {};
        var wwwCfg = {
            url: 'phonegap-template-hello-world',
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, cfg , jasmine.any(Object));
    });

    it('should create a external project when supplied', function() {
        options.template = 'cordova-app-hello-world'; 
        phonegap.create(options);
        var cfg = {};
        var wwwCfg = {
            url: 'phonegap-template-hello-world', //'cordova-app-hello-world',
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, options.id, options.name, cfg , jasmine.any(Object));
    });

});

Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });

