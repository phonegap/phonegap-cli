/*!
 * Module dependencies.
 */

var path = require('path'),
  fs = require('fs'),
  colors = require('colors');

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

module.exports = function (argv, callback) {

  var getFilePath = function (fileName) {
    fileName.push('txt');
    fileName = fileName.join('.');
    // full path
    fileName = path.join(basepath, fileName);
    return fileName;
  };

  var printFileContents = function (filePath) {
    var data = fs.readFileSync(filePath, 'utf8');
    data = data.trim().replace(/\$0/g, argv.$0);
    console.log('\n' + data + '\n');
  };

  // help file directory
  var basepath = path.join(__dirname, '..', '..', 'doc', 'cli'),
    filepath;

  // filename format: command.command.txt
  filepath = getFilePath(argv._.slice(0));

  // get help info and replace $0 with process name
  if (!fs.existsSync(filepath)) {
    console.log('\nInvalid Usage: ' + 'phonegap '+argv._.slice(0).join(' ').red+'\n\nUsage: phonegap help \n');
    return;
  }

  printFileContents(filepath);
  callback(null);
};
