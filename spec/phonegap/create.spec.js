/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('cordova'),
    shell = require('shelljs'),
    phonegap,
    options;

/*
 * Specification: phonegap.create
 */

describe('create(options, callback)', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(cordova, 'create');
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

    it('should try to create a project', function() {
        phonegap.create(options);
        expect(cordova.create).toHaveBeenCalledWith(options.path);
    });

    describe('successfully created a project', function() {
        beforeEach(function() {
            cordova.create.andReturn();
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
            cordova.create.andCallFake(function(path) {
                throw new Error('path already exists');
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
                expect(e).toEqual(jasmine.any(String));
                done();
            });
            phonegap.create(options);
        });

        // remove when cordova-cli workaround does not need to exists
        describe('throws a String as an error', function() {
            beforeEach(function() {
                cordova.create.andCallFake(function(path) {
                    throw 'path already exists';
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
                    expect(e).toEqual(jasmine.any(String));
                    done();
                });
                phonegap.create(options);
            });
        });
    });
});
