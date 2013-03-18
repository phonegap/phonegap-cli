/*
 * Module dependencies.
 */

var PhoneGap = require('./phonegap');

/**
 * Command line interface object.
 */

function CLI() {
    this.phonegap = new PhoneGap();

    // FIX: Must expose root elements to sub-elements
    this.remote.phonegap = this.phonegap;
    this.remote.parent = this;
}

/**
 * Command line commands.
 */

CLI.prototype.argv = require('./cli/argv');
CLI.prototype.help = require('./cli/help');
CLI.prototype.remote = require('./cli/remote');
CLI.prototype.remote.build = require('./cli/remote.build');
CLI.prototype.remote.login = require('./cli/remote.login');
CLI.prototype.remote.logout = require('./cli/remote.logout');
CLI.prototype.unknown = require('./cli/unknown');
CLI.prototype.version = require('./cli/version');
CLI.prototype.create = require('./cli/create');
CLI.prototype.app = require('./cli/app');

/*
 * Expose the CLI object.
 */

module.exports = CLI;
