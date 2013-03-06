/*
 * Module dependencies.
 */

/**
 * Command line interface object.
 */

function CLI() {
}

/**
 * Command line commands.
 */

CLI.prototype.argv = require('./cli/argv');
CLI.prototype.version = require('./cli/version');
CLI.prototype.help = require('./cli/help');

/*
 * Expose the CLI object.
 */

module.exports = CLI;
