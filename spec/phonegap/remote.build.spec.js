/*
 * Module dependencies.
 */

var phonegapbuild = require('../../lib/phonegap/util/phonegap-build'),
    PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    events = require('events'),
    phonegap,
    appData,
    options,
    stdout;

/*
 * Specification: phonegap.remote.build(options, [callback])
 */

describe('phonegap.remote.build(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        appData = {
            id: '1234',
            title: 'My App',
            download: {
                android: '/api/v1/apps/322388/android'
            }
        };
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        spyOn(phonegap.remote, 'login');
        spyOn(phonegapbuild, 'build');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.remote.build(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.remote.build(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.remote.build(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.remote.build(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.remote.build(options)).toEqual(phonegap);
    });

    it('should try to build the project', function() {
        phonegap.remote.build(options);
        expect(phonegapbuild.build).toHaveBeenCalledWith(
            {
                platforms: ['android']
            },
            jasmine.any(Function)
        );
    });

    describe('successful project build', function() {
        beforeEach(function() {
            phonegapbuild.build.andCallFake(function(opts, callback) {
                callback(null, appData);
            });
        });

        it('should call callback without an error', function(done) {
            phonegap.remote.build(options, function(e, data) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should call callback with a data object', function(done) {
            phonegap.remote.build(options, function(e, data) {
                expect(data).toEqual(appData);
                done();
            });
        });
    });

    describe('failed project build', function() {
        beforeEach(function() {
            phonegapbuild.build.andCallFake(function(opts, callback) {
                var e = new Error('could not connect to PhoneGap/Build');
                phonegapbuild.emit('error', e);
                callback(e);
            });
        });

        it('should call callback with an error', function(done) {
            phonegap.remote.build(options, function(e, data) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should fire "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.remote.build(options);
        });
    });
});
