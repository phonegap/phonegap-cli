
var serveModule = require("../../lib/phonegap/serve"),
    server = require("connect-phonegap"),
    cordova = require('../../lib/cordova').cordova,
    project = require("../../lib/phonegap/util/project"),
    serve = null;


var dummyPromise = { then: function() {} },
    realPromise = { then: function(f) { f(); } };


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

            preparePromise = dummyPromise;
            spyOn(cordova, 'prepare').andCallFake(function(platforms, callback) {
                callback(true);
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

        it("should return the wrapper object given to create", function () {
            var ret = serve({});
            expect(ret).toEqual(wrapper);
        });

        it("should accept empty options", function() {
            expect(function() {
                serve({});
            }).not.toThrow();
        });

        it("should not require callback parameter", function() {
            expect(function() {
                serve(validOptions);
            }).not.toThrow();
        });

        it("should not require options.port", function() {
            expect(function() {
                serve({port:undefined});
            }).not.toThrow();
        });

        it("should not require options.port", function() {
            expect(function() {
                serve({port:undefined});
            }).not.toThrow();
        });

        it("should change to the project directory", function () {
            serve(validOptions);
            expect(project.cd).toHaveBeenCalled();
        });

        it('should prepare the build first', function() {
            serve({});
            expect(cordova.prepare).toHaveBeenCalled();
            expect(cordova.prepare).toHaveBeenCalledWith([], jasmine.any(Function));
        });

        it("should call connect-phonegap listen", function () {
            preparePromise = realPromise;
            serve({});
            expect(server.listen).toHaveBeenCalled();
        });

        it("should call connect-phonegap listen with valid options passed through", function () {
            preparePromise = realPromise;
            serve(validOptions);
            expect(server.listen).toHaveBeenCalledWith(validOptions);
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
                    throw new Error('IWETTUM!');
                });
            });
            it('should still serve', function() {
                serve(defaultOptions);
                expect(server.listen).toHaveBeenCalledWith(defaultOptions);
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

            it("should call connect-phonegap listen with default options", function () {
                preparePromise = realPromise;
                serve(invalidOptions);
                expect(server.listen).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        port: defaultOptions.port,
                        autoreload: defaultOptions.autoreload,
                        localtunnel: defaultOptions.localtunnel,
                        phonegap: jasmine.any(Object)
                    })
                );
            });

            it("should call connect-phonegap listen with corrected autoreload option", function () {
                defaultOptions.autoreload = "batman";
                preparePromise = realPromise;
                serve(defaultOptions);
                expect(server.listen.argsForCall[0][0].autoreload).toEqual(true);
            });

            it("should call connect-phonegap listen with corrected localtunnel option", function () {
                defaultOptions.localtunnel = "batman";
                preparePromise = realPromise;
                serve(defaultOptions);
                expect(server.listen.argsForCall[0][0].localtunnel).toEqual(false);
            });
        });
    });
});
