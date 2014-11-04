var shell = require('shelljs'),
    path = require('path'),
    bin = 'node ' + path.resolve(path.join(__dirname, '..', '..', 'bin', 'phonegap.js'));

describe('$ phonegap cordova', function() {
    beforeEach(function() {
        spyOn(process.stdout, 'write');
        spyOn(process.stderr, 'write');
    });

    it('should bypass the PhoneGap CLI chain', function() {
        var version = require('../../node_modules/cordova/package.json').version;
        var process = shell.exec(bin + ' cordova --version', { silent: true });
        expect(process.output).toMatch(version);
    });
});
