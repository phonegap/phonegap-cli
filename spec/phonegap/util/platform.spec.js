/*!
 * Module dependencies.
 */

var platform = require('../../../lib/phonegap/util/platform'),
    platforms;

/*!
 * Specification: Platform Operations
 */

describe('platform', function() {
    describe('platform.names(platforms)', function() {
        describe('when platforms is undefined', function() {
            beforeEach(function() {
                platforms = undefined;
            });

            it('should return an empty array', function() {
                expect(platform.names(platforms)).toEqual([]);
            });
        });

        describe('when platforms is null', function() {
            beforeEach(function() {
                platforms = null;
            });

            it('should return an empty array', function() {
                expect(platform.names(platforms)).toEqual([]);
            });
        });

        describe('when platforms is an empty array', function() {
            beforeEach(function() {
                platforms = [];
            });

            it('should return an empty array', function() {
                expect(platform.names(platforms)).toEqual([]);
            });
        });

        describe('when platforms is defined', function() {
            beforeEach(function() {
                platforms = ['android', 'blackberry', 'ios'];
            });

            it('should return an array of the same length', function() {
                expect(platform.names(platforms).length).toEqual(platforms.length);
            });

            describe('each element', function() {
                it('should have a local, remote, and human keys', function() {
                    platforms = platform.names(platforms);
                    platforms.forEach(function(platform) {
                        expect(platform).toEqual({
                            local: jasmine.any(String),
                            remote: jasmine.any(String),
                            human: jasmine.any(String)
                        });
                    });
                });
            });

            describe('unsupport element', function() {
                beforeEach(function() {
                    platforms = ['android', 'unsupported'];
                });

                // TODO - rethink how to handle unsupported platforms
                it('should be ignored', function() {
                    platforms = platform.names(platforms);
                    expect(platforms.length).toEqual(1);
                    expect(platforms[0].local).toEqual('android');
                });
            });
        });
    });

    describe('supports', function() {
        beforeEach(function() {
            platforms = [ 'android', 'ios' , 'blackberry10' ];
        });


        it('should return the same array when called with valid platforms', function () {
            var result = platform.supports(platforms);

            expect(result.length).toEqual(platforms.length);
            expect(result).toEqual(platforms);
        });


        it('should return an empty array when called with invalid platforms', function () {
            var result = platform.supports(['none','are','platforms']);

            expect(result.length).toEqual(0);
            expect(result).toEqual([]);
        });


        it('should return only the valid platforms when called with an invalid platform', function () {
            var result;

            platforms.push('notaplatform');
            result = platform.supports(platforms);
            expect(result).toEqual(platforms.slice(0,3));
        });
    });
});
