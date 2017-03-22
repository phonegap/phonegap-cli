/*!
 * Module dependencies.
 */

var path = require('path'),
    fs = require('fs');

/**
 * $ phonegap help [command]
 *
 * Outputs the usage information for a given command.
 * Each command documents the help information under /doc/cli/command.txt
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is null unless there is an error.
 */

module.exports = function(argv, callback) {
    // help file directory
    var basepath = path.join(__dirname, '..', '..', 'doc', 'cli'),
        filepath,
        data;

    // filename format: command.command.txt
    filepath = argv._.slice(0);
    filepath.push('txt');
    filepath = filepath.join('.');

    // alias for the serve, plugin, template commands
    filepath = filepath.replace('help.app.txt', 'help.serve.txt');
    filepath = filepath.replace('help.plugin', 'help.local.plugin');
    filepath = filepath.replace('help.recipe', 'help.template');

    // full path
    filepath = path.join(basepath, filepath);

    // get help info and replace $0 with process name
    if (!fs.existsSync(filepath)) {
        this.cli.unknown(argv, callback);
        return;
    }
    data = fs.readFileSync(filepath, 'utf8');
    data = data.trim().replace(/\$0/g, argv.$0);

    console.log('\n' + data + '\n');
    callback(null);
};
