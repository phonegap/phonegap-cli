/*!
 * Module dependencies.
 */

var pkg = require('../../../package.json'),
    updateNotifier = require('update-notifier');

/*!
 * Check if there is a newer version of the CLI published.
 */

module.exports.start = function() {
    var notifier = updateNotifier({
        pkg: pkg
    });

    notifier.notify();
};
