var opener = require('opener');
var os_name = require('os-name');
var pkgjson = require('../../package.json');

var baseUrl = "https://github.com/phonegap/phonegap-cli/issues/new?";
var prelude = "body=";
var coda = "%0aSteps+to+Reproduce%3a%0a%0a1.%0a2";

/**
 * $ phonegap report-issue
 *
 * Opens the default webbrowser where you can submit an issue to the team
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 */

module.exports = function(argv, callback) {
    var dataStr =  '\nnode-version:\t' + process.version +
                   '\ncli-version:\t' + pkgjson.version +
                   '\nplatform:\t' + os_name() +
                   '\n --- \n';

    var url = baseUrl + prelude + escape(dataStr) + coda;

    opener(url);
    callback();
};
