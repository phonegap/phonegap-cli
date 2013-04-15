/*
 * Module dependencies.
 */

var phonegapbuild = require('../../lib/phonegap/util/phonegap-build'),
    PhoneGap = require('../../lib/phonegap'),
    events = require('events'),
    phonegap,
    emitter,
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
        emitter = new events.EventEmitter();
        spyOn(process.stdout, 'write');
        spyOn(phonegap.remote, 'login');
        spyOn(phonegapbuild, 'build').andReturn(emitter);
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
                return emitter;
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
                return emitter;
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
