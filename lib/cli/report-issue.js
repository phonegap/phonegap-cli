

var opener = require('opener');
var analytics = require('./analytics');
var os_name = require('os-name');
var pkgjson = require('../../package.json');

var baseUrl = "https://github.com/phonegap/phonegap-cli/issues/new?";
var prelude = "body=";
var coda = "%0a-+Steps+to+Reproduce%3a%0a%0a1.%0a2";

/*!
 * Module dependencies.
 */

var phonegap = require('../main');

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
    var data = {
        'node-version':process.version,
        'cli-version': pkgjson.version,
        'platform': os_name()
    };
    var url = baseUrl + prelude +
              escape(JSON.stringify(data,null,"\t")) +
              coda;
    var editor = opener(url);
    callback();
};
