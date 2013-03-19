/*
 * Module dependencies.
 */

var config = require('../../../lib/common/config'),
    shell = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    data;

/*
 * Specification for config.
 */

describe('config.global', function() {
    describe('config.global.path', function() {
        it('should be a valid dirname', function() {
            var dirname = path.dirname(config.global.path);
            expect(fs.existsSync(dirname)).toBe(true);
        });
    });

    describe('config.global.load(callback)', function() {
        it('should require the callback function', function() {
            expect(function() { config.global.load(); }).toThrow();
        });

        it('should try to find config file', function() {
            spyOn(fs, 'exists');
            config.global.load(function(e, data) {});
            expect(fs.exists).toHaveBeenCalled();
            expect(fs.exists.mostRecentCall.args[0]).toEqual(
                path.join(config.global.path, 'config.json')
            );
        });

        describe('successfully found config file', function() {
            beforeEach(function() {
                spyOn(fs, 'exists').andCallFake(function(filepath, callback) {
                    callback(true);
                });
            });

            it('should read config file', function() {
                spyOn(fs, 'readFile');
                config.global.load(function(e, data) {});
                expect(fs.readFile).toHaveBeenCalled();
                expect(fs.readFile.mostRecentCall.args[0]).toEqual(
                    path.join(config.global.path, 'config.json')
                );
            });

            describe('successfully read config file', function() {
                beforeEach(function() {
                    spyOn(fs, 'readFile').andCallFake(function(filepath, callback) {
                        callback(null, '{ "phonegap" : { "token": "abc123" } }');
                    });
                });

                it('should trigger callback without an error', function(done) {
                    config.global.load(function(e, data) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with config file object', function(done) {
                    config.global.load(function(e, data) {
                        expect(data).toEqual({ phonegap: { token: 'abc123' } });
                        done();
                    });
                });
            });

            describe('failed reading config file', function() {
                beforeEach(function() {
                    spyOn(fs, 'readFile').andCallFake(function(filepath, callback) {
                        callback(new Error('file does not exist'));
                    });
                });

                it('should trigger callback with an error', function(done) {
                    config.global.load(function(e, data) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger callback without config file object', function(done) {
                    config.global.load(function(e, data) {
                        expect(data).not.toBeDefined();
                        done();
                    });
                });
            });
        });

        describe('config file missing', function() {
            beforeEach(function() {
                spyOn(fs, 'exists').andCallFake(function(filepath, callback) {
                    callback(false);
                });
            });

            it('should try to save a config file', function() {
                spyOn(config.global, 'save');
                config.global.load(function(e, data) {});
                expect(config.global.save).toHaveBeenCalled();
            });

            describe('successfully save config file', function() {
                beforeEach(function() {
                    spyOn(config.global, 'save').andCallFake(function(data, callback) {
                        callback(null);
                    });
                });

                it('should save an empty object', function() {
                    config.global.load(function(e, data) {});
                    expect(config.global.save.mostRecentCall.args[0]).toEqual({ phonegap: {} });
                });

                it('should trigger callback without an error', function(done) {
                    config.global.load(function(e, data) {
                        expect(e).toBeNull();
                        done();
                    });
                });

                it('should trigger callback with config file object', function(done) {
                    config.global.load(function(e, data) {
                        expect(data).toEqual({ phonegap: {} });
                        done();
                    });
                });
            });

            describe('failed to save config file', function() {
                beforeEach(function() {
                    spyOn(config.global, 'save').andCallFake(function(data, callback) {
                        callback(new Error('no write access'));
                    });
                });

                it('should trigger callback with an error', function(done) {
                    config.global.load(function(e, data) {
                        expect(e).toEqual(jasmine.any(Error));
                        done();
                    });
                });

                it('should trigger callback without config file object', function(done) {
                    config.global.load(function(e, data) {
                        expect(data).not.toBeDefined();
                        done();
                    });
                });
            });
        });
    });

    describe('config.global.save(data, callback)', function() {
        beforeEach(function() {
            data = { phonegap: { token: 'abc123' } };
            spyOn(shell, 'mkdir');
            spyOn(fs, 'writeFile');
        });

        it('should require the data parameter', function() {
            expect(function() { config.global.save(); }).toThrow();
        });

        it('should require the callback parameter', function() {
            expect(function() { config.global.save(data); }).toThrow();
        });

        it('should recursively create directories', function() {
            config.global.save(data, function(e) {});
            expect(shell.mkdir).toHaveBeenCalled();
            expect(shell.mkdir.mostRecentCall.args[0]).toEqual('-p');
        });

        it('should try to write', function() {
            config.global.save(data, function(e) {});
            expect(fs.writeFile).toHaveBeenCalled();
            expect(fs.writeFile.mostRecentCall.args[0]).toEqual(
                path.join(config.global.path, 'config.json')
            );
        });

        describe('successful write', function() {
            beforeEach(function() {
                fs.writeFile.andCallFake(function(filepath, data, callback) {
                    callback(null);
                });
            });

            it('should write to the config file', function() {
                config.global.save(data, function(e) {});
                expect(fs.writeFile.mostRecentCall.args[0]).toEqual(
                    path.join(config.global.path, 'config.json')
                );
            });

            it('should write the json data', function(done) {
                config.global.save({ phonegap: { token: 'def456', username: 'link' } }, function(e) {
                    var data = JSON.parse(fs.writeFile.mostRecentCall.args[1]);
                    expect(data).toEqual({ phonegap: { token: 'def456', username: 'link' } });
                    done();
                });
            });

            it('should trigger callback without an error', function(done) {
                config.global.save({ phonegap: { token: 'def456' } }, function(e) {
                    expect(e).toBeNull();
                    done();
                });
            });
        });

        describe('failed write', function() {
            beforeEach(function() {
                fs.writeFile.andCallFake(function(filepath, data, callback) {
                    callback(new Error('no write access'));
                });
            });

            it('should trigger callback with an error', function(done) {
                config.global.save({ phonegap: { token: 'def456' } }, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
