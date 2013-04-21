/*!
 * Module dependencies.
 */

var phonegap = require('./main'),
    console = require('./cli/util/console');

/**
 * Command line interface object.
 */

function CLI() {
    // This can be prevented by using dependency injection
    this.cli = this;
    this.local.cli = this;
    this.remote.cli = this;
}

/**
 * Command line commands.
 */

CLI.prototype.app = require('./cli/app');
CLI.prototype.argv = require('./cli/argv');
CLI.prototype.create = require('./cli/create');
CLI.prototype.build = require('./cli/build');
CLI.prototype.run = require('./cli/run');
CLI.prototype.help = require('./cli/help');
CLI.prototype.local = require('./cli/local');
CLI.prototype.local.build = require('./cli/local.build');
CLI.prototype.local.run = require('./cli/local.run');
CLI.prototype.remote = require('./cli/remote');
CLI.prototype.remote.login = require('./cli/remote.login');
CLI.prototype.remote.logout = require('./cli/remote.logout');
CLI.prototype.remote.build = require('./cli/remote.build');
CLI.prototype.remote.run = require('./cli/remote.run');
CLI.prototype.unknown = require('./cli/unknown');
CLI.prototype.version = require('./cli/version');

/*!
 * CLI messages.
 */

phonegap.on('log', function() {
    console.log.apply(this, arguments);
});

phonegap.on('warn', function() {
    console.warn.apply(this, arguments);
});

phonegap.on('error', function(e) {
    console.error.call(this, e.message);
});

phonegap.on('raw', function() {
    console.raw.apply(this, arguments);
});

/*!
 * Expose the CLI object.
 */

module.exports = CLI;
