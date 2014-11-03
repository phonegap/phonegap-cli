/*!
 * Module dependencies.
 */

var project = require('../../../lib/phonegap/util/project'),
    cdvutil = require('../../../lib/cordova').util,
    events = require('events'),
    chdir = require('chdir'),
    path = require('path'),
    fs = require('fs'),
    currentPath,
    projectPath,
    delegate;

/*!
 * Specification: Project Operations
 */

describe('project', function() {
    describe('project.cd(delegate)', function() {
        beforeEach(function() {
            currentPath = process.cwd();
            projectPath = currentPath;
            delegate = {
                emitter: new events.EventEmitter(),
                callback: function(e) {}
            };
            delegate.emitter.on('error', function(e) {});  // required error catcher

        });

        describe('when in project path', function() {

            beforeEach(function() {
                spyOn(cdvutil, 'isCordova').andCallFake(function(_path) {
                    return true;
                });
            });

            it('should return the path', function() {
                expect(project.cd(delegate)).toEqual(projectPath);
            });
        });

        describe('when in a subdirectory of the project path', function() {
            beforeEach(function() {
                currentPath = path.join(projectPath, 'lib', 'phonegap');
                spyOn(cdvutil, 'isCordova').andCallFake(function(_path) {
                    return _path === projectPath;
                });
            });

            it('should return the path', function() {

                chdir(currentPath, function() {
                    expect(project.cd(delegate)).toEqual(projectPath);
                });
            });
        });

        describe('when not in a project', function() {
            beforeEach(function() {
                currentPath = path.join(projectPath, '..');
            });

            it('should return null', function() {
                chdir(currentPath, function() {
                    expect(project.cd(delegate)).toBeNull();
                });
            });

            it('should ignore home directory .cordova/', function() {
                spyOn(project, 'isHome').andReturn(true);
                chdir(currentPath, function() {
                    expect(project.cd(delegate)).toBeNull();
                });
            });

            it('should fire delegate "error" event', function(done) {
                delegate.emitter.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
                chdir(currentPath, function() {
                    project.cd(delegate);
                });
            });

            it('should trigger delegate callback with error', function() {
                spyOn(delegate, 'callback');
                chdir(currentPath, function() {
                    project.cd(delegate);
                    expect(delegate.callback).toHaveBeenCalledWith(
                        jasmine.any(Error)
                    );
                });
            });
        });
    });

    describe('listPlatforms', function () {
        var exampleOut = ['platformA', 'platformB'];


        beforeEach(function() {
            spyOn(cdvutil, 'listPlatforms').andCallFake(function() {
                return exampleOut;
            }); 
        });        

        it('should be defined', function() {
            expect(project.listPlatforms).toBeDefined();    
        });

        it('should pass the results of the cordova-lib utility', function () {
            var ret = project.listPlatforms();
            expect(ret).toEqual(exampleOut);
        });

        describe('checkPlatform', function () {
            it('should be defined', function() {
                expect(project.checkPlatform).toBeDefined();
            });
            it('should return true if the platform is installed', function () {
                var platform = exampleOut[0];
                expect(project.checkPlatform(platform)).toBe(true);
            });
            it('should return false if the platform is not found', function () {
                var platform = "IMadeThisUp";
                expect(project.checkPlatform(platform)).toBe(false);
            });
        });
    
    });


    describe('readPackage', function () {
        var relativePath;
        
        beforeEach(function() {
            packagepath = path.join(__dirname, '..', '..', '..', 'package.json');
            spyOn(JSON,'parse').andReturn({});
        });

        it('should be defined', function() {
            expect(project.readPackage).toEqual(jasmine.any(Function));
        });

        it('should return the package.json contents', function() {
            expect(project.readPackage()).toEqual({}); 
        });
    });

    describe('clobbersConfig', function() {
        var fixtureUri = '/User/dev/correct/uri/to/config',
            fixtureContent = 'aabbcc';

        beforeEach(function(){
            createSpyObj('fs', ['open','readFile']);
            spyOn(fs,'readFile').andReturn(null,'');
        });

        it('should be defined clue', function() {
            expect(project.clobberProjectConfig).toBeDefined();
        });
        it('should return null if path is invalid', function () {
            var res = project.clobberProjectConfig('blarg',{});
        });
        it('should return the path of the config file when successful', function () {
            var res = project.clobberProjectConfig(fixtureUri, {'aa':'bb','cc':'bb'});

            expect(res).toEqual(fixtureUri); 
        });
    });
});
