/*!
 * Module dependencies.
 */

var dns = require('dns');

/**
 * Check network connectivity.
 *
 * Options:
 *
 *   - `callback` {Function} triggered on completion.
 *     - `online` {Boolean} is true if connected to the Internet otherwise false.
 */

module.exports.isOnline = function(callback) {
    // This approach is very quick and appear to work correctly.
    // However, the node.js documentation warns that `lookup`
    // may not use the network connection.
    //
    // Reference: http://stackoverflow.com/questions/15270902/
    //            check-for-internet-connectivity-in-nodejs
    dns.lookup('google.com', function(e) {
        if (e && e.code === 'ENOTFOUND') {
            callback(false);
        }
        else {
            callback(true);
        }
    });
};
