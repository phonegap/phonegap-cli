
var serveModule = require("../../lib/phonegap/serve"),
    server = require("connect-phonegap"),
    cordova = require('../../lib/cordova').cordova,
    project = require("../../lib/phonegap/util/project"),
    Q = require('q'),
    serve = null;

describe("PhoneGap serve", function () {
    describe("module", function () {
        it("should export at object", function() {
            expect(serveModule).toEqual(any(Object));
        });

        it("should export an object with a create parameter", function() {
            expect(serveModule.create).toEqual(any(Function));
        });
    });

    describe("when called", function() {
        var validOptions,
            wrapper;

        beforeEach(function() {
            // valid options
            validOptions = {
                port:3939,
                autoreload:true,
                localtunnel:false
            };
            // define wrapper as a stub
            wrapper = {
                emit: function() {},
                on: function() {}
            };

            // initialize the serve function with wrapper
            serve = serveModule.create(wrapper);

            // declare spies
            spyOn(project,'cd').andReturn(true);

            spyOn(cordova, 'prepare').andCallFake(function(platforms) {
                return Q();
            });

            spyOn(server,'listen').andReturn({ on: function() { return this; }});
        });

        it("should be a function", function() {
            expect(serve).toEqual(any(Function));
        });

        it("should require options parameter", function() {
            expect(function() {
                serve();
            }).toThrow();
        });

        it("should return the wrapper object given to create", function (done) {
            serve({})
            .then(function(ret) {
                expect(ret).toEqual(wrapper);
                done();
            });
        });

        it("should not require callback parameter", function(done) {
            serve(validOptions)
            .then(function(ret) {
                expect(ret).toEqual(wrapper);
                done();
            });
        });

        it("should not require options.port", function(done) {
            serve({port:undefined})
            .then(function(ret) {
                expect(ret).toEqual(wrapper);
                done();
            });
        });

        it("should change to the project directory", function (done) {
            serve(validOptions)
            .then(function() {
                expect(project.cd).toHaveBeenCalled();
                done();
            });
        });

        it('should prepare the build first', function(done) {
            serve({})
            .then(function() {
                expect(cordova.prepare).toHaveBeenCalled();
                expect(cordova.prepare).toHaveBeenCalledWith([]);
                done();
            });
        });

        it("should call connect-phonegap listen", function (done) {
            serve({})
            .then(function() {
                expect(server.listen).toHaveBeenCalled();
                done();
            });
        });

        it("should call connect-phonegap listen with valid options passed through", function (done) {
            serve(validOptions)
            .then(function() {
                expect(server.listen).toHaveBeenCalled();
                expect(server.listen).toHaveBeenCalledWith(validOptions);
                done();
            });
        });

        describe("if cordova prepare throws", function () {
            var defaultOptions;

            beforeEach(function () {
                defaultOptions = {
                    port: 3000,
                    autoreload: true,
                    localtunnel: false
                };

                cordova.prepare.andCallFake(function () {
                    return Q.reject('IWETTUM!');
                });
            });

            it('should still serve', function(done) {
                serve(defaultOptions)
                .then(function() {
                    expect(server.listen).toHaveBeenCalledWith(defaultOptions);
                    done();
                });
            });
        });

        describe("if called with invalid options", function () {
            var invalidOptions,
                defaultOptions;

            beforeEach(function () {
                invalidOptions = {
                    port: undefined,
                    autoreload:"batman",
                    localtunnel:"wonderwoman"
                };
                defaultOptions = {
                    port: 3000,
                    autoreload: true,
                    localtunnel: false,
                    phonegap: {
                        emit: function() {},
                        on: function() {}
                    }
                };
            });

            it("should call connect-phonegap listen with default options", function (done) {
                serve(invalidOptions)
                .then(function() {
                    expect(server.listen).toHaveBeenCalledWith(
                        jasmine.objectContaining({
                            port: defaultOptions.port,
                            autoreload: defaultOptions.autoreload,
                            localtunnel: defaultOptions.localtunnel,
                            phonegap: jasmine.any(Object)
                        }));
                    done();
                });
            });

            it("should call connect-phonegap listen with corrected autoreload option", function (done) {
                defaultOptions.autoreload = "batman";
                serve(defaultOptions)
                .then(function() {
                    expect(server.listen.argsForCall[0][0].autoreload).toEqual(true);
                    done();
                });
            });

            it("should call connect-phonegap listen with corrected localtunnel option", function (done) {
                defaultOptions.localtunnel = "batman";
                serve(defaultOptions)
                .then(function() {
                    expect(server.listen.argsForCall[0][0].localtunnel).toEqual(false);
                    done();
                });
            });
        });
    });
});
