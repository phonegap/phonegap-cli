/*
 * Module dependencies.
 */
var PhoneGap = require('../lib/phonegap'),
    cordova = require('../lib/cordova').cordova,
    cordovaCommon = require('cordova-common'),
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
        console.log("fake");
        return Q(); 
    });

/*
 * Specification: phonegap.create(options, [callback])
 */

describe('create.new.spec.js "phonegap.create"', function() {
    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
        mockery.registerMock('cordova-create', cordovaCreateSpy);
        mockery.warnOnUnregistered(false);
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };

        // configParserSpy = {
        //     name: jasmine.createSpy('configParser name'),
        //     version: jasmine.createSpy('configParser version')
        // };
        // spyOn(cordovaCommon, 'ConfigParser').andCallFake(function(){
        //     this.name = configParserSpy.name,
        //     this.version = configParserSpy.version
        // });
        
        configParserSpy = jasmine.createSpyObj('configParserSpy', ['name', 'version']);
        spyOn(cordovaCommon, 'ConfigParser').andReturn(configParserSpy); 

        spyOn(fs, 'writeFileSync').andCallFake(function(){});
        spyOn(fs, 'existsSync').andCallFake(function(){return false}); //If true, then will try to open pkg json which doesn't exist
    });

    afterEach(function(){
        mockery.resetCache();
        mockery.deregisterMock('cordova-create');
        mockery.disable();
    });

    it('should try to create a project with default values', function() {
        var flag, cfg, wwwCfg;
        
        cfg = {};
        wwwCfg = {
            url: "phonegap-template-hello-world",
            template: true
        };
        cfg.lib = {};
        cfg.lib.www = wwwCfg;
        name = options.name || 'Hello World';
        id = options.id || 'com.phonegap.helloworld';
        
        runs(function(){
            phonegap.create(options, function(e) {
                //expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
                expect(cordovaCommon.ConfigParser).toHaveBeenCalledWith(
                    '/some/path/to/app/www/config.xml'
                );
                flag = true;
            });
        })

        waitsFor(function(){
            return flag;
        }, 'phonegap create timeout', 10000);
        
        
    });

//     it('should try to create a project with a given name and id', function() {
//         var flag, cfg, wwwCfg;

//         cfg = {};
//         wwwCfg = {
//             url: "phonegap-template-hello-world",
//             template: true
//         };
//         cfg.lib = {};
//         cfg.lib.www = wwwCfg;
//         options.id = 'com.example.app';
//         options.name = 'My App';
//         name = options.name || 'Hello World';
//         id = options.id || 'com.phonegap.helloworld';

//         runs(function(){
//             phonegap.create(options, function(e) {
//                 expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
//                 flag = true;
//             });
//         });

//         waitsFor(function(){
//             return flag;
//         }, 'phonegap create timeout', 10000); 
//     });

//     it('should try to create a project with a given config', function() {
//         var flag;

//         options.id = 'com.example.app';
//         options.name = 'My App';
//         options.config = { some: 'value' };
//         name = options.name || 'Hello World';
//         id = options.id || 'com.phonegap.helloworld';

//         runs(function(){
//             phonegap.create(options, function(e) {
//                 expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, options.config, jasmine.any(Object));
//                 flag = true;
//             });
//         });

//         waitsFor(function(){
//             return flag;
//         }, 'phonegap create timeout', 10000);
//     });

//     it('should try to create a project with a template with a npm name', function() {
//         var flag, cfg, wwwCfg;
        
//         options.template = 'phonegap-template-react-hot-loader';
//         name = options.name || 'Hello World';
//         id = options.id || 'com.phonegap.helloworld';
//         cfg = {};
//         wwwCfg = {
//             url: options.template,
//             template: true
//         };
//         cfg.lib = {};
//         cfg.lib.www = wwwCfg;

//         runs(function(){
//             phonegap.create(options, function(e) {
//                 expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
//                 flag = true;
//             });
//         });

//         waitsFor(function(){
//             return flag;
//         }, 'phonegap create timeout', 10000);
//     });


//     it('should try to create a project with a template with a shortened name', function() {
//         var flag, cfg, wwwCfg;

//         options.template = 'blank';
//         name = options.name || 'Hello World';
//         id = options.id || 'com.phonegap.helloworld';
//         cfg = {};
//         wwwCfg = {
//             url: "phonegap-template-blank",
//             template: true
//         };
//         cfg.lib = {};
//         cfg.lib.www = wwwCfg;


//         runs(function(){
//             phonegap.create(options, function(e) {
//                 expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
//                 flag = true;
//             });
//         });

//         waitsFor(function(){
//             return flag;
//         }, 'phonegap create timeout', 10000);
//     });
        
//     it('should create a default project when template name invalid', function() {
//         var flag, cfg, wwwCfg;

//         options.template = true; // equivalent to --template
//         name = options.name || 'Hello World';
//         id = options.id || 'com.phonegap.helloworld';
//         cfg = {};
//         wwwCfg = {
//             url: 'phonegap-template-hello-world',
//             template: true
//         };
//         cfg.lib = {};
//         cfg.lib.www = wwwCfg;


//         runs(function(){
//             phonegap.create(options, function(e) {
//                 expect(cordovaCreateSpy).toHaveBeenCalledWith(options.path, id, name, cfg, jasmine.any(Object));
//                 flag = true;
//             });
//         });

//         waitsFor(function(){
//             return flag;
//         }, 'phonegap create timeout', 10000);
//     });

//     it('should trigger callback without an error', function(done) {
//         var flag;

//         runs(function(){
//             phonegap.create(options, function(e) {
//                 expect(e).toBeNull();
//                 flag = true;
//             });
//         });

//         waitsFor(function(){
//             return flag;
//         }, 'phonegap create timeout', 10000);
//     });

});

Object.keys(require.cache).forEach(function(key) { delete require.cache[key] });

