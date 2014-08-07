
var serveModule = require("../../lib/phonegap/serve"),
    project = require("../../lib/phonegap/util/project"),
    serve;

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
            wrapper = {
                emit: function(){}
            };

        beforeEach(function() {
            validOptions = {
                port:3939,
                autoreload:true,
                localtunnel:false
            };

            serve = serveModule.create(wrapper);
            
            spyOn(project,'cd');
            
        });

        it("should be a function", function() {
            expect(serve).toEqual(any(Function));
        });

        it("should return the wrapper object given to create", function () {
            var ret = serve({}); 
            expect(ret).toEqual(wrapper);
        });

        it("should require options parameter", function(){
            expect(function() {
                serve();
            }).toThrow();
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


    });

});
