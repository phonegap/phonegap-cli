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

CLI.prototype.argv = require('./cli/argv');
CLI.prototype.cordova = require('./cli/cordova');
CLI.prototype.create = require('./cli/create');
CLI.prototype.help = require('./cli/help');
CLI.prototype.install = require('./cli/install');
CLI.prototype.local = require('./cli/local');
CLI.prototype.template = require('./cli/template');
CLI.prototype.template.list = require('./cli/template.list');
CLI.prototype.recipe = require('./cli/template');
CLI.prototype.recipe.list = require('./cli/template.list');
CLI.prototype.remote = require('./cli/remote');
CLI.prototype.remote.build = require('./cli/remote.build');
CLI.prototype.remote.install = require('./cli/remote.install');
CLI.prototype.remote.login = require('./cli/remote.login');
CLI.prototype.remote.logout = require('./cli/remote.logout');
CLI.prototype.remote.run = require('./cli/remote.run');
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
    console.error.call(this, (e.message || e));
});

phonegap.on('raw', function() {
    console.raw.apply(this, arguments);
});

/*!
 * Expose the CLI object.
 */

module.exports = CLI;
