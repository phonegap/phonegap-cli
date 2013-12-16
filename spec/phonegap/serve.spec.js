/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    events = require('events'),
    soundwave = require('phonegap-soundwave'),
    phonegap,
    options;

/*!
 * Specification: phonegap.serve(options, [callback])
 */

describe('phonegap.serve(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(project, 'cd').andReturn(true);     
        spyOn(soundwave,'serve');
        spyOn(soundwave,'on').andCallThrough();
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.serve(options, function(e) {});
        }).toThrow();
    });

    it('should not require options.port', function() {
        expect(function() {
            options.port = undefined;
            phonegap.serve(options, function(e) {});
        }).not.toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.serve(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.serve(options)).toEqual(phonegap);
    });

    it('should change to project directory', function() {
        phonegap.serve(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should try to serve the project', function() {
        phonegap.serve(options);
        expect(soundwave.serve).toHaveBeenCalled();
    });

    describe('when successfully started server', function() {
        beforeEach(function() {
            soundwave.serve.andCallFake(function(options, callback) {
                callback(null, {
                    address: '127.0.0.1',
                    port: 3000
                });
            });
        });

        it('should fire callback without an error', function(done) {
            phonegap.serve(options, function(e, server) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should fire callback with server options', function(done) {
            phonegap.serve(options, function(e, server) {
                expect(server).toEqual(jasmine.any(Object));
                done();
            });
        });

        describe('on request and response', function() {
            it('should trigger a "log" event', function(done) {
                phonegap.on('log', function(message) {
                    expect(message).toEqual(jasmine.any(String));
                    done();
                });
                phonegap.serve(options);
                soundwave.emit('log', '201 /path/to/a/file.html');
            });
        });
    });

    describe('when failed to start server', function() {
        beforeEach(function() {
            soundwave.serve.andCallFake(function(options, callback) {
                var e = new Error('port in use');
                //soundwave.on('error', function() {});
                //soundwave.emit('error', e);
                callback(e);
            });
        });

        it('should fire callback with an error', function(done) {
            phonegap.serve(options, function(e, server) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        //it('should trigger error event', function(done) {
        //    phonegap.on('error', function(e, server) {
        //        expect(e).toEqual(jasmine.any(Error));
        //        done();
        //    });
        //    phonegap.serve(options);
        //});
    });
});
