/*
 * Module dependencies.
 */

var config = require('../../../lib/common/config'),
    path = require('path'),
    fs = require('fs');

/**
 * Specification for local configuration file.
 */

describe('config.local', function() {
    describe('config.local.load(callback)', function() {
        beforeEach(function() {
            spyOn(fs, 'readFile');
        });

        it('should require the callback parameter', function() {
            expect(function() {
                config.local.load();
            }).toThrow();
        });

        it('should try to read the configuration file', function() {
            config.local.load(function(e, data) {});
            expect(fs.readFile).toHaveBeenCalled();
            expect(fs.readFile.mostRecentCall.args[0]).toEqual(
                path.join(process.cwd(), '.cordova', 'config.json')
            );
        });

        describe('successfully read configuration file', function() {
            beforeEach(function() {
                fs.readFile.andCallFake(function(path, callback) {
                    callback(null, '{}');
                });
            });

            it('should trigger callback without an error', function(done) {
                config.local.load(function(e, data) {
                    expect(e).toBeNull();
                    done();
                });
            });

            it('should trigger callback with data', function(done) {
                config.local.load(function(e, data) {
                    expect(data).toEqual(jasmine.any(Object));
                    done();
                });
            });
        });

        describe('failed to read configuration file', function() {
            beforeEach(function() {
                fs.readFile.andCallFake(function(path, callback) {
                    callback(new Error('file not found'));
                });
            });

            it('should trigger callback without an error', function(done) {
                config.local.load(function(e, data) {
                    expect(e).not.toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should trigger callback with default data', function(done) {
                config.local.load(function(e, data) {
                    expect(data).toEqual({});
                    done();
                });
            });
        });
    });

    describe('config.local.save(data, callback)', function() {
        var data;

        beforeEach(function() {
            data = {
                id: 'io.cordova.hellocordova',
                name: 'HelloCordova'
            };
            spyOn(fs, 'writeFile');
        });

        it('should require the data parameter', function() {
            expect(function() {
                config.local.save();
            }).toThrow();
        });

        it('should require the callback parameter', function() {
            expect(function() {
                config.local.save({});
            }).toThrow();
        });

        it('should try to write the data to the file', function() {
            config.local.save(data, function(e) {});
            expect(fs.writeFile).toHaveBeenCalled();
            expect(fs.writeFile.mostRecentCall.args[1]).toEqual(JSON.stringify(data));
        });

        describe('successful file write', function() {
            beforeEach(function() {
                fs.writeFile.andCallFake(function(filepath, data, callback) {
                    callback(null);
                });
            });

            it('should trigger callback without an error', function(done) {
                config.local.save(data, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed file write', function() {
            beforeEach(function() {
                fs.writeFile.andCallFake(function(filepath, data, callback) {
                    callback(new Error('permission denied'));
                });
            });

            it('should trigger callback with an error', function(done) {
                config.local.save(data, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
