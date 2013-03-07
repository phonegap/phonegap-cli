/*
 * Module dependencies.
 */

var cordova = require('cordova'),
    create = require('../../lib/phonegap/create'),
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

    it('should try to create a cordova project', function(done) {
        create(options, function(e) {});
        process.nextTick(function() {
            expect(cordova.create).toHaveBeenCalledWith(
                options.path
            );
            done();
        });
    });

    describe('successfully created a project', function() {
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
            cordova.create.andCallFake(function() {
                // cordova does not consistently throw Error objects
                throw 'missing the path';
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
