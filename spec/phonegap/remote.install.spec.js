/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    qrcode = require('qrcode-terminal'),
    phonegap,
    options;

/*
 * Specification: phonegap.remote.install(options, [callback])
 */

describe('phonegap.remote.install(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.remote.install(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.remote.install(options, function(e) {});
        }).toThrow();
    });

    it('should not require options.data', function() {
        expect(function() {
            options.data = undefined;
            phonegap.remote.install(options, function(e) {});
        }).not.toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.remote.install(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.remote.install(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.remote.install(options)).toEqual(phonegap);
    });

    describe('with options.data', function() {
        beforeEach(function() {
            options.data = {
                download: {
                    android: '/api/v1/apps/1234'
                },
                token: 'abc123'
            };
        });

        it('should generate a qrcode', function() {
            spyOn(qrcode, 'generate');
            phonegap.remote.install(options);
            expect(qrcode.generate).toHaveBeenCalled();
        });

        it('should call callback without an error', function(done) {
            phonegap.remote.install(options, function(e, data) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should call callback with a data object', function(done) {
            phonegap.remote.install(options, function(e, data) {
                expect(data).toEqual(jasmine.any(Object));
                expect(data.url).toEqual(jasmine.any(String));
                done();
            });
        });

        describe('with optional server arguments', function() {
            it('should call callback with a data object', function(done) {
                options.protocol = 'http:';
                options.host = 'stage.build.phonegap.com';
                options.port = '80';

                phonegap.remote.install(options, function(e, data) {
                    expect(data).toEqual(jasmine.any(Object));
                    expect(data.url).toMatch('http://stage.build.phonegap.com:80');
                    done();
                });
            });
        });
    });

    describe('without options.data', function() {
        beforeEach(function() {
            options.data = undefined;
        });

        it('should call callback an error', function(done) {
            phonegap.remote.install(options, function(e, data) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should fire "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.remote.install(options);
        });
    });
});
