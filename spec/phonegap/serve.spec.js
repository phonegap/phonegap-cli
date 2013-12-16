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
                soundwave.emit('log', 'serve has started');
                callback();
            });
        });

        it('should emit a "log" event', function(done) {
            phonegap.on('log', function(message) {
                expect(message).toEqual(jasmine.any(String));
                done();
            });
            phonegap.serve(options);
        });
    });

});
