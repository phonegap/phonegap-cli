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

            describe('symbian', function() {
                beforeEach(function() {
                    platforms = ['symbian'];
                });

                it('should support remote', function() {
                    platforms = platform.names(platforms);
                    expect(platforms.length).toEqual(1);
                    expect(platforms[0].local).toBe(null);
                    expect(platforms[0].remote).toBe('symbian');
                    expect(platforms[0].human).toBe('Symbian');
                });
            });
        });
    });
});
