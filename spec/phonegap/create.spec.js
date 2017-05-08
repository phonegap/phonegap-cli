/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    cordova = require('../../lib/cordova'),
    network = require('../../lib/phonegap/util/network'),
    shell = require('shelljs'),
    path = require('path'),
    fs = require('fs'),
    phonegap,
    options;

/*
 * Specification: phonegap.create(options, [callback])
 */

describe('phonegap.create(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            path: path.resolve('spec', 'fixture', 'app-with-config', 'www')
        };
        spyOn(phonegap, 'version').andReturn({ phonegap: '2.8.0' });
        spyOn(phonegap, 'cordova');
        spyOn(network, 'isOnline').andCallFake(function(callback) {
            callback(false); // offline by default to speed up tests
        });
        spyOn(cordova.cordova, 'config');
        spyOn(cordova.lib.configparser.prototype, 'write');
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

    it('should try to create a project with default values', function() {
        phonegap.create(options);
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" --template="phonegap-template-hello-world"'
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
                cmd: 'cordova create "$path" "$id" "$name" --template="phonegap-template-hello-world"'
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
                cmd: 'cordova create "$path" "$id" "$name" "$config" --template="phonegap-template-hello-world"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', options.config)
            },
            jasmine.any(Function)
        );
    });

    it('should try to create a project with a template with a npm name', function() {
        options.template = 'phonegap-template-react-hot-loader';
        phonegap.create(options);
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" --template="phonegap-template-react-hot-loader"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', options.config)
            },
            jasmine.any(Function)
        );
    });

    it('should try to create a project with a template with a shortened name', function() {
        options.template = 'blank';
        phonegap.create(options);
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" --template="phonegap-template-blank"'
                        .replace('$path', options.path)
                        .replace('$id', options.id)
                        .replace('$name', options.name)
                        .replace('$config', options.config)
            },
            jasmine.any(Function)
        );
    });

    it('should create a default project when template name invalid', function() {
        options.template = true; // equivalent to --template
        phonegap.create(options);
        expect(phonegap.cordova).toHaveBeenCalledWith(
            {
                cmd: 'cordova create "$path" "$id" "$name" --template="phonegap-template-hello-world"'
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
