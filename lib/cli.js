/*
 * Module dependencies.
 */

var PhoneGap = require('./phonegap');

/**
 * Command line interface object.
 */

function CLI() {
    this.phonegap = new PhoneGap();
    this.remote.phonegap = this.phonegap; // FIX: exposed for CLI.prototype.remote.login
}

/**
 * Command line commands.
 */

CLI.prototype.argv = require('./cli/argv');
CLI.prototype.help = require('./cli/help');
CLI.prototype.remote = require('./cli/remote');
CLI.prototype.help.remote = require('./cli/help/remote');
CLI.prototype.remote.login = require('./cli/remote/login');
CLI.prototype.help.remote.login = require('./cli/help/remote/login');
CLI.prototype.unknown = require('./cli/unknown');
CLI.prototype.version = require('./cli/version');
CLI.prototype.create = require('./cli/create');
CLI.prototype.help.create = require('./cli/help/create');
CLI.prototype.app = require('./cli/app');
CLI.prototype.help.app = require('./cli/help/app');

/*
 * Expose the CLI object.
 */

module.exports = CLI;
