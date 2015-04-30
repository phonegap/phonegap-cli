/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('../../lib/cordova').cordova,
    cordovaLib = require('../../lib/cordova').lib,
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
        spyOn(cordova, 'config');
        spyOn(cordovaLib, 'configparser').andReturn(configParserSpy);
        spyOn(shell, 'rm');
        spyOn(shell, 'cp');
        spyOn(fs, 'renameSync');
        spyOn(fs, 'existsSync');

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

    it('should try to create a project with default values', function() {
        phonegap.create(options);
        /*expect(cordova.config).toHaveBeenCalledWith(
            options.path,
            {
                lib: {
                    www: {
                        id: 'hello-world-template',
                        version: jasmine.any(String),
                        uri: jasmine.any(String),
                        link: false
                    }
                }
            }
        );*/
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" "$config"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', options.config)
            },
            jasmine.any(Function)
        );
    });

    it('should try to create a project with a given name and id', function() {
        options.id = 'com.example.app';
        options.name = 'My App';
        phonegap.create(options);
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" "$config"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', options.config)
            },
            jasmine.any(Function)
        );
    });

    it('should try to create a project with a given config', function() {
        options.id = 'com.example.app';
        options.name = 'My App';
        options.config = { some: 'value' };
        phonegap.create(options);
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" "$config"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', '{\\"some\\":\\"value\\",\\"lib\\":{\\"www\\":{\\"id\\":\\"hello-world-template\\",\\"version\\":\\"master\\",\\"uri\\":\\"https://github.com/phonegap/phonegap-app-hello-world/archive/master.tar.gz\\",\\"link\\":false}}}')
            },
            jasmine.any(Function)
        );
    });

    it('should try to create a project with a template', function() {
        options.template = 'hello-cordova';
        phonegap.create(options);
        /*expect(cordova.config).toHaveBeenCalledWith(
            options.path,
            {
                lib: {
                    www: {
                        id: 'hello-cordova-template',
                        version: jasmine.any(String),
                        uri: jasmine.any(String),
                        link: false
                    }
                }
            }
        );*/
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" "$config"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', options.config)
            },
            jasmine.any(Function)
        );
    });

    describe('successfully created a project', function() {
        beforeEach(function() {
            phonegap.cordova.andCallFake(function(options, callback) {
                callback(null);
            });
        });

        describe('when my-app/www/config.xml exists', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(true);
            });

            it('should move it to my-app/config.xml', function(done) {
                phonegap.create(options, function(e) {
                    expect(fs.existsSync).toHaveBeenCalled();
                    expect(fs.renameSync).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when my-app/www/config.xml does not exist', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(false);
            });

            it('should not move it to my-app/config.xml', function(done) {
                phonegap.create(options, function(e) {
                    expect(fs.existsSync).toHaveBeenCalled();
                    expect(fs.renameSync).not.toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when updating config.xml', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(true);
            });

            it('should parse the my-app/config.xml', function(done) {
                phonegap.create(options, function(e) {
                    expect(cordovaLib.configparser).toHaveBeenCalledWith(
                        path.join(options.path, 'config.xml')
                    );
                    expect(configParserSpy.setPackageName).toHaveBeenCalledWith(options.id);
                    expect(configParserSpy.setName).toHaveBeenCalledWith(options.name);
                    expect(configParserSpy.write).toHaveBeenCalled();
                    done();
                });
            });
        });

        describe('when config.xml does not exist', function() {
            beforeEach(function() {
                fs.existsSync.andReturn(false);
            });

            it('should trigger a "warn" event', function(done) {
                phonegap.on('warn', function(message) {
                    expect(message).toMatch('could not update');
                    done();
                });
                phonegap.create(options, function(e) {});
            });
        });

        describe('when --link-to is provided', function() {
            beforeEach(function() {
                options['link-to'] = '/path/to/app';
            });

            it('should not move config.xml', function(done) {
                phonegap.create(options, function(e) {
                    expect(fs.existsSync).not.toHaveBeenCalled();
                    expect(fs.renameSync).not.toHaveBeenCalled();
                    done();
                });
            });

            it('should not update config.xml', function(done) {
                expect(fs.existsSync).not.toHaveBeenCalled();
                expect(cordovaLib.configparser).not.toHaveBeenCalled();
                done();
            });
        });

        describe('when complete', function() {
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
