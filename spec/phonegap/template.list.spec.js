/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    phonegap,
    options;

/*
 * Specification: phonegap.template.list(options, [callback])
 */

describe('phonegap.template.list(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {};
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.template.list(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.template.list(options);
        }).not.toThrow();
    });

    it('should return itself', function() {
        expect(phonegap.template.list(options)).toEqual(phonegap);
    });

    it('should list the available template names', function(done) {
        var templates = require('../../package.json').templates;
        phonegap.template.list(options, function(e, data) {
            expect(data.templates).toEqual(jasmine.any(Object));
            expect(data.templates.length).toEqual(
                Object.keys(templates).length
            );
            done();
        });
    });

    describe('each template', function() {
        it('should contain a name and description', function(done) {
            phonegap.template.list(options, function(e, data) {
                expect(data.templates[0].name).toEqual(jasmine.any(String));
                expect(data.templates[0].description).toEqual(jasmine.any(String));
                done();
            });
        });
    });
});
