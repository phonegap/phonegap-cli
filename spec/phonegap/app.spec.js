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
 * Specification: phonegap.app(options, [callback])
 */

describe('phonegap.app(options, [callback])', function() {
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
            phonegap.app(options, function(e) {});
        }).toThrow();
    });

    it('should not require options.port', function() {
        expect(function() {
            options.port = undefined;
            phonegap.app(options, function(e) {});
        }).not.toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.app(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.app(options)).toEqual(phonegap);
    });

    it('should change to project directory', function() {
        phonegap.app(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should try to serve the project', function() {
        phonegap.app(options);
        expect(http.createServer).toHaveBeenCalled();
    });

    describe('when successfully started server', function() {
        it('should listen on the default port (3000)', function() {
            phonegap.app(options);
            expect(serverSpy.listen).toHaveBeenCalledWith(3000);
        });

        it('should listen on the specified port', function() {
            options.port = 1337;
            phonegap.app(options);
            expect(serverSpy.listen).toHaveBeenCalledWith(1337);
        });

        it('should trigger callback with server object', function(done) {
            phonegap.app(options, function(e, server) {
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
                phonegap.app(options, function(e) {});
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
                phonegap.app(options);
                request.emit('end');
            });
        });
    });

    describe('when failed to start server', function() {
        it('should trigger callback with an error', function(done) {
            phonegap.app(options, function(e) {
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
            phonegap.app(options);
            serverSpy.emit('error', new Error('port in use'));
        });
    });
});
