
var serveModule = require("../../lib/phonegap/serve"),
    http = require("http"),
    server = require("connect-phonegap"), 
    project = require("../../lib/phonegap/util/project"),
    preparePromise = null,
    serve = null;


var dummyPromise = { then: function() {} },
    realPromise = { then: function(f) { f(); } };

var CordovaSpy;

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

            CordovaSpy = createSpy('Phonegap Cordova Spy').andCallFake(function(cmd, callback){
                callback();
            });

            // define wrapper as a stub
            wrapper = {
                emit: function(){},
                on: function(){},
                cordova : CordovaSpy
            };

            // initialize the serve function with wrapper
            serve = serveModule.create(wrapper);
           
            // declare spies 
            spyOn(project,'cd').andReturn(true);

            preparePromise = dummyPromise;

            spyOn(server,'listen').andReturn({ on: function() { return this; }});
        });

        afterEach(function(){
            this.removeAllSpies();
        });

        it("should be a function", function() {
            expect(serve).toEqual(any(Function));
        });

        it("should require options parameter", function(){
            expect(function() {
                serve();
            }).toThrow();
        });

        it("should return the wrapper object given to create", function () {
            var ret = serve({}); 
            expect(ret).toEqual(wrapper);
        });

        it("should accept empty options", function(){
            expect(function() {
                serve({});
            }).not.toThrow();
        });
   
        it("should not require callback parameter", function(){
            expect(function() {
                serve(validOptions);
            }).not.toThrow();
        });

        it("should not require options.port", function(){
            expect(function() {
                serve({port:undefined});
            }).not.toThrow();    
        });

        it("should not require options.port", function(){
            expect(function() {
                serve({port:undefined});
            }).not.toThrow();    
        });

        it("should change to the project directory", function (){
            serve(validOptions);
            expect(project.cd).toHaveBeenCalled(); 
        });

        it('should prepare the build first', function() {
            serve({});
            expect(CordovaSpy).toHaveBeenCalledWith({cmd: 'cordova prepare'}, jasmine.any(Function));
        });

        it("should call connect-phonegap listen", function (){
            preparePromise = realPromise;
            serve({});
            expect(server.listen).toHaveBeenCalled();
        });

        it("should call connect-phonegap listen with valid options passed through", function (){
            preparePromise = realPromise;
            serve(validOptions);
            expect(server.listen).toHaveBeenCalledWith(validOptions);
        });

        describe("if cordova prepare throws", function () {
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
                    localtunnel: false
                };

                CordovaSpy.andCallFake(function(cmd, callback){
                    callback(new Error('IWETTUM!'));
                });
            });

            it("should call connect-phonegap listen", function (){
                preparePromise = realPromise;
                serve({});
                expect(server.listen).toHaveBeenCalled();
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
                        emit: function(){},
                        on: function(){}
                    }
                };

            });
 
            it("should call connect-phonegap listen with default options", function (){
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
 
            it("should call connect-phonegap listen with corrected autoreload option", function (){
                defaultOptions.autoreload = "batman";
                preparePromise = realPromise;
                serve(defaultOptions);
                expect(server.listen.argsForCall[0][0].autoreload).toEqual(true);
            });

            it("should call connect-phonegap listen with corrected localtunnel option", function (){
                defaultOptions.localtunnel = "batman";
                preparePromise = realPromise;
                serve(defaultOptions);
                expect(server.listen.argsForCall[0][0].localtunnel).toEqual(false);
            });

        });
    });
});
