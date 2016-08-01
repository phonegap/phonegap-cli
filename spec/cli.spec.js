var shell = require('shelljs'),
    path = require('path'),
    bin = 'node ' + '"' + path.resolve(path.join(__dirname, '..', 'bin', 'phonegap.js')) + '"';

describe('$ phonegap [options] commands', function() {
    beforeEach(function() {
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
    });

    it('should support no arguments', function() {
        var process = shell.exec(bin + '', { silent: true });
        expect(process.output).toMatch('Usage:');
    });

    it('should support commands', function() {
        var process = shell.exec(bin + ' version', { silent: true });
        expect(process.output).toMatch(/^\w+\.\w+\.\w+/);
    });

    it('should support options', function() {
        var process = shell.exec(bin + ' --version', { silent: true });
        expect(process.output).toMatch(/^\w+\.\w+\.\w+/);
    });

    it('should have exit code 0', function() {
        var process = shell.exec(bin + ' --version', { silent: true });
        expect(process.code).toEqual(0);
    });

    describe('on an error', function() {
        it('should have non-zero exit code', function() {
            var process = shell.exec(bin + ' cordova noop', { silent: true });
            expect(process.code).not.toEqual(0);
        });
    });
});
