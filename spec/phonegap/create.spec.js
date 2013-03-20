/*
 * Module dependencies.
 */

var create = require('../../lib/phonegap/create'),
    cordova = require('cordova'),
    options;

/*
 * Create specification.
 */

describe('create(options, callback)', function() {
    beforeEach(function() {
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(cordova, 'create');
        spyOn(create, 'updateProject'); // ignore
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            create(options, function(e) {});
        }).toThrow();
    });

    it('should require options.path', function() {
        expect(function() {
            options.path = undefined;
            create(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            create(options);
        }).not.toThrow();
    });

    it('should try to create a project', function(done) {
        create(options, function(e) {});
        process.nextTick(function() {
            expect(cordova.create).toHaveBeenCalledWith(options.path);
            done();
        });
    });

    describe('successfully created a project', function() {
        beforeEach(function() {
            cordova.create.andReturn();
        });

        it('should trigger called without an error', function(done) {
            create(options, function(e) {
                expect(e).toBeNull();
                done();
            });
        });

        it('should trigger "complete" event', function(done) {
            var emitter = create(options);
            emitter.on('complete', function() {
                done();
            });
        });
    });

    describe('failed to create a project', function() {
        beforeEach(function() {
            cordova.create.andCallFake(function(path) {
                throw new Error('path already exists');
            });
        });

        it('should trigger callback with an error', function(done) {
            create(options, function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        it('should trigger "error" event', function(done) {
            var emitter = create(options);
            emitter.on('error', function(e) {
                expect(e).toEqual(jasmine.any(Error));
                done();
            });
        });

        // remove when cordova-cli workaround does not need to exists
        describe('throws a String as an error', function() {
            beforeEach(function() {
                cordova.create.andCallFake(function(path) {
                    throw 'path already exists';
                });
            });

            it('should trigger callback with an error', function(done) {
                create(options, function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });

            it('should trigger "error" event', function(done) {
                var emitter = create(options);
                emitter.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    done();
                });
            });
        });
    });
});
