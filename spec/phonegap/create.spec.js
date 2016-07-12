/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('../../lib/cordova').cordova,
    cordovaLib = require('../../lib/cordova').lib,
    network = require('../../lib/phonegap/util/network'),
    shell = require('shelljs'),
    path = require('path'),
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
            path: '/some/path/to/app/www'
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

    describe('successfully created a project', function() {
        beforeEach(function() {
            phonegap.cordova.andCallFake(function(options, callback) {
                callback(null);
            });
        });


        /* Removed following tests. Config.xml is handled by Cordova Create and link-to has been deprecated
        'when my-app/www/config.xml exists should move it to my-app/config.xml'
        'when my-app/www/config.xml does not exist should not move it to my-app/config.xml'       
        'when updating config.xml should parse the my-app/config.xml'
        'when config.xml does not exist should trigger a "warn" event'
        'when --link-to is provided should not move config.xml should not update config.xml'
         */
        
        describe('when complete', function() {
            //ToDo: @carynbear callback is made on successes, but getting an error still
            it('should trigger callback without an error', function(done) {
                phonegap.create(options, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });
    });

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
