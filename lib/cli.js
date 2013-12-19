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
    this.local.plugin.cli = this;
    this.platform.cli = this;
    this.plugin.cli = this;
    this.remote.cli = this;
}

/**
 * Command line commands.
 */

CLI.prototype.argv = require('./cli/argv');
CLI.prototype.build = require('./cli/build');
CLI.prototype.create = require('./cli/create');
CLI.prototype.help = require('./cli/help');
CLI.prototype.install = require('./cli/install');
CLI.prototype.local = require('./cli/local');
CLI.prototype.local.build = require('./cli/local.build');
CLI.prototype.local.install = require('./cli/local.install');
CLI.prototype.local.plugin = require('./cli/local.plugin');
CLI.prototype.local.plugin.add = require('./cli/local.plugin.add');
CLI.prototype.local.plugin.list = require('./cli/local.plugin.list');
CLI.prototype.local.plugin.remove = require('./cli/local.plugin.remove');
CLI.prototype.local.run = require('./cli/local.run');
CLI.prototype.platform = require('./cli/platform');
CLI.prototype.platform.update = require('./cli/platform.update');
CLI.prototype.plugin = require('./cli/plugin');
CLI.prototype.plugin.add = require('./cli/plugin.add');
CLI.prototype.plugin.remove = require('./cli/plugin.remove');
CLI.prototype.plugin.list = require('./cli/plugin.list');
CLI.prototype.remote = require('./cli/remote');
CLI.prototype.remote.build = require('./cli/remote.build');
CLI.prototype.remote.install = require('./cli/remote.install');
CLI.prototype.remote.login = require('./cli/remote.login');
CLI.prototype.remote.logout = require('./cli/remote.logout');
CLI.prototype.remote.run = require('./cli/remote.run');
CLI.prototype.run = require('./cli/run');
CLI.prototype.serve = require('./cli/serve');
CLI.prototype.app = CLI.prototype.serve;
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
