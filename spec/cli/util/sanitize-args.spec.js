
var sanitizeArgs = require('../../../lib/cli/util/sanitize-args');

describe('sanitize-args', function() {

    it('should exist and export a `clean` function', function(done) {
        expect(sanitizeArgs).toBeDefined();
        expect(sanitizeArgs.clean).toBeDefined();
        done();
    });

    it('should exist not fail with empty args', function(done) {
        var result = sanitizeArgs.clean();
        expect(result).toBeDefined();
        done();
    });

    it('should return all args for basic commands',function(done) {
        var params = ["a", "b", "c"];
        var commands = ["help", "serve", "build", "prepare", "compile", "info", "template"];
        commands.forEach(function(elem){
            var result = sanitizeArgs.clean([elem,params]);
            expect(result).toBeDefined();
            expect(result.command).toBeDefined();
            expect(result.command).toBe(elem);
            expect(result.params).toBeDefined();
            expect(result.params).toBe(params.join());
        });
        done();
    });

    it('should clean `create` calls',function(done) {
        var result = sanitizeArgs.clean(["create","--verbose","secretProjectPath","projName", "-d"]);
        console.log("result:" + JSON.stringify(result));
        expect(result).toBeDefined();
        done();
    });

    it('should handle `cordova create` calls',function(done) {
        var result = sanitizeArgs.clean(["cordova", "create", "--verbose","secretProjectPath","projName", "-d"]);
        console.log("result:" + JSON.stringify(result));
        expect(result).toBeDefined();
        done();
    });

    it('should handle `cordova plugin ls` calls',function(done) {
        var result = sanitizeArgs.clean(["plugin", "ls","extraJunk"]);
        console.log("result:" + JSON.stringify(result));
        expect(result).toBeDefined();
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    // todo: plugin add + remove + rm

    it('should handle `cordova platform ls` calls',function(done) {
        var result = sanitizeArgs.clean(["platform", "ls","extraJunk"]);
        console.log("result:" + JSON.stringify(result));
        expect(result).toBeDefined();
        expect(result.params).toBe("ls,extraJunk");
        done();
    });

    // todo: platform add + remove + rm

});
