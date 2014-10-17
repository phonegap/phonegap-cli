/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova-lib').cordova,
    phonegap,
    options,
    qyes,
    qno;
/*
 * Specification: phonegap.install(options, [callback])
 */

describe('phonegap.install(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        qyes = {
            then : function(success, fail) {
                success();
            }
        }
        qno = {
            then : function(success, fail) {
                fail();
            }
        }
        spyOn(process.stderr, 'write');
        spyOn(phonegap.local, 'install').andReturn(phonegap);
        spyOn(phonegap.remote, 'install').andReturn(phonegap);
        spyOn(cordova, 'platform');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.install(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.install(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.install(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.install(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should add the platform if it is not already present', function () {
        expect(cordova.platform).toHaveBeenCalledWith(
            'add',
            options.platforms,
            function () {} 
        );
    });

    it('should not attempt to execute the remote build command if platform is unsupported', function () {
        expect(phonegap.local.install).toHaveBeenCalled();
        expect(phonegap.remote.install).not.toHaveBeenCalled();
    });


    it('should return itself', function() {
        expect(phonegap.install(options)).toEqual(phonegap);
    });


    describe('with local environment', function() {
        it('should try to install the app locally', function() {
            var callback = function() {};
            phonegap.install(options, callback);
            expect(phonegap.local.install).toHaveBeenCalledWith(options, callback);
        });
    });

    describe('with remote environment', function() {
        beforeEach(function() {
            cordova.platform.andCallFake(function(){
                throw new Error;
            });
        });

        it('should try to install the app remotely', function() {
            var callback = function() {};
            phonegap.install(options, callback);
            expect(phonegap.remote.install).toHaveBeenCalledWith(options, callback);
        });
    });
});
