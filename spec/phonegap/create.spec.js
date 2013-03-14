/*
 * Module dependencies.
 */

var create = require('../../lib/phonegap/create'),
    options;

/*
 * Create specification.
 */

describe('create(options, callback)', function() {
    beforeEach(function() {
        options = {
            path: '/some/path/to/app/www'
        };
        spyOn(create.phonegapbuild, 'create');
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
            expect(create.phonegapbuild.create).toHaveBeenCalledWith(
                options,
                jasmine.any(Function)
            );
            done();
        });
    });

    describe('successfully created a project', function() {
        beforeEach(function() {
            create.phonegapbuild.create.andCallFake(function(options, callback) {
                callback();
            });
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
            create.phonegapbuild.create.andCallFake(function(options, callback) {
                callback(new Error('missing the path'));
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
