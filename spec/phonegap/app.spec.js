/*
 * Module dependencies.
 */

var app = require('../../lib/phonegap/app'),
    http = require('http'),
    events = require('events'),
    Static = require('node-static'),
    request,
    serverSpy,
    serveSpy,
    options;

/*
 * App specification.
 */

describe('app(options, callback)', function() {
    beforeEach(function() {
        options = {};
        // mock the http.createServer
        spyOn(http, 'createServer').andCallFake(function(callback) {
            request = new events.EventEmitter();
            serverSpy = new events.EventEmitter();
            serverSpy.listen = jasmine.createSpy();
            callback(request); // bind routes
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
            app(options, function(e) {});
        }).toThrow();
    });

    it('should not require options.port', function() {
        expect(function() {
            options.port = undefined;
            app(options, function(e) {});
        }).not.toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            app(options);
        }).not.toThrow();
    });

    it('should try to serve the project', function(done) {
        app(options, function(e) {});
        process.nextTick(function() {
            expect(http.createServer).toHaveBeenCalled();
            done();
        });
    });

    describe('when successfully started server', function() {
        it('should listen on the default port (3000)', function(done) {
            app(options, function(e) {});
            process.nextTick(function() {
                expect(serverSpy.listen).toHaveBeenCalledWith(3000);
                done();
            });
        });

        it('should listen on the specified port', function(done) {
            options.port = 1337;
            app(options, function(e) {});
            process.nextTick(function() {
                expect(serverSpy.listen).toHaveBeenCalledWith(1337);
                done();
            });
        });

        it('should emit the event listening', function(done) {
            var e = app(options, function() {});
            e.on('listening', function(server) {
                expect(server.address).toEqual(jasmine.any(String));
                expect(server.port).toEqual(options.port);
                done();
            });
            process.nextTick(function() {
                serverSpy.emit('listening');
            });
        });

        describe('on request', function() {
            it('should serve a response', function(done) {
                app(options, function(e) {});
                process.nextTick(function() {
                    request.emit('end');
                    expect(serveSpy).toHaveBeenCalled();
                    done();
                });
            });

            it('should emit a request event', function(done) {
                serveSpy.andCallFake(function(request, response, callback) {
                    callback();
                });
                var e = app(options, function() {});
                e.on('request', function(request, response) {
                    done();
                });
                process.nextTick(function() {
                    request.emit('end');
                });
            });
        });
    });

    describe('when failed to start server', function() {
        it('should trigger callback with an error', function(done) {
            app(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            process.nextTick(function() {
                serverSpy.emit('error', new Error('port in use'));
            });
        });

        it('should emit the event error', function(done) {
            var r = app(options, function() {});
            r.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
            process.nextTick(function() {
                serverSpy.emit('error', new Error('port in use'));
            });
        });
    });
});
