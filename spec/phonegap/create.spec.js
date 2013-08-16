/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('cordova'),
    shell = require('shelljs'),
    phonegap,
    options;

/*
 * Specification: phonegap.create(options, [callback])
 */

describe('phonegap.create(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(phonegap, 'version').andReturn({ phonegap: '2.8.0' });
        spyOn(cordova, 'create');
        spyOn(cordova, 'config');
        spyOn(shell, 'rm');
        spyOn(shell, 'cp');
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

    it('should not require callback', function() {
        expect(function() {
            phonegap.create(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.create(options)).toEqual(phonegap);
    });

    it('should use phonegap hello world app', function() {
        phonegap.create(options);
        expect(cordova.config).toHaveBeenCalledWith(options.path, {
            lib: {
                www: {
                    id: 'phonegap',
                    version: '2.8.0',
                    uri: jasmine.any(String)
                }
            }
        });
    });

    it('should try to create a project with default values', function() {
        phonegap.create(options);
        expect(cordova.create).toHaveBeenCalledWith(
            options.path,
            'com.phonegap.helloworld',
            'HelloWorld',
            jasmine.any(Function)
        );
    });

    it('should try to create a project with custom values', function() {
        options.id = 'com.example.app';
        options.name = 'My App';
        phonegap.create(options);
        expect(cordova.create).toHaveBeenCalledWith(
            options.path,
            options.id,
            options.name,
            jasmine.any(Function)
        );
    });

    describe('successfully created a project', function() {
        beforeEach(function() {
            cordova.create.andCallFake(function(path, id, name, callback) {
                callback(null);
            });
        });

        it('should trigger called without an error', function(done) {
            phonegap.create(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });
    });

    describe('failed to create a project', function() {
        beforeEach(function() {
            cordova.create.andCallFake(function(path, id, name, callback) {
                callback(new Error('path already exists'));
            });
        });

        it('should trigger callback with an error', function(done) {
            phonegap.create(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.create(options);
        });
    });
});
