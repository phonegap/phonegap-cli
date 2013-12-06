/*!
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    http = require('http'),
    events = require('events'),
    Static = require('node-static'),
    serverSpy,
    serveSpy,
    phonegap,
    request,
    options;

/*!
 * Specification: phonegap.serve(options, [callback])
 */

describe('phonegap.serve(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
        spyOn(project, 'cd').andReturn(true);
        // mock the http.createServer
        spyOn(http, 'createServer').andCallFake(function(callback) {
            request = new events.EventEmitter();
            request.url = '/some/path';
            serverSpy = new events.EventEmitter();
            serverSpy.listen = jasmine.createSpy();
            callback(request, { status: 200 }); // bind routes
            return serverSpy;
        });
        // mock node-static
        serveSpy = jasmine.createSpy('file.serve');
        spyOn(Static, 'Server').andReturn({
            serve: serveSpy
        });
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
        expect(http.createServer).toHaveBeenCalled();
    });

    describe('when successfully started server', function() {
        it('should listen on the default port (3000)', function() {
            phonegap.serve(options);
            expect(serverSpy.listen).toHaveBeenCalledWith(3000);
        });

        it('should listen on the specified port', function() {
            options.port = 1337;
            phonegap.serve(options);
            expect(serverSpy.listen).toHaveBeenCalledWith(1337);
        });

        it('should trigger callback with server object', function(done) {
            phonegap.serve(options, function(e, server) {
                expect(server).toEqual({
                    address: '127.0.0.1',
                    port: 3000
                });
                done();
            });
            serverSpy.emit('listening');
        });

        describe('on request', function() {
            it('should serve a response', function() {
                phonegap.serve(options, function(e) {});
                request.emit('end');
                expect(serveSpy).toHaveBeenCalled();
            });

            it('should emit a "log" event', function(done) {
                serveSpy.andCallFake(function(request, response, callback) {
                    callback(null, { status: 200 });
                });
                phonegap.on('log', function(request, response) {
                    done();
                });
                phonegap.serve(options);
                request.emit('end');
            });
        });
    });

    describe('when failed to start server', function() {
        it('should trigger callback with an error', function(done) {
            phonegap.serve(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            serverSpy.emit('error', new Error('port in use'));
        });

        it('should fire "error" event', function(done) {
            phonegap.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            phonegap.serve(options);
            serverSpy.emit('error', new Error('port in use'));
        });
    });
});
