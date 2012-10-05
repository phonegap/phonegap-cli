#!/usr/bin/env node

// Module dependencies.

var fs = require('fs');
var path = require('path');
var phonegap = require('../lib/phonegap');

// Load package.json

var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'), 'utf8'));

// Set the help message

var help = function() {
    console.log('Synopsis');
    console.log('');
    console.log('  cordova command [options]');
    console.log('');
    console.log('Global Commands');
    console.log('');
    console.log('  create [path]..................... creates a cordova project in the specified directory');
    console.log('');
    console.log('Project-Level Commands');
    console.log('');
    console.log('  platform [add|remove|ls [name]] .. adds or removes a platform, or lists all currently-added platforms');
    console.log('  plugin [add|remove|ls [path]] .... adds or removes a plugin (from the specified path), or lists all currently-added plugins');
    console.log('  build ............................ builds a cordova project');
    console.log('  emulate .......................... starts emulator for cordova project');
    console.log('  docs ............................. serves docs at http://localhost:2222');
    console.log('');
    console.log('Example usage');
    console.log('');
    console.log('  $ cordova create Baz');
    console.log('  $ cd Baz');
    console.log('  $ cordova platform add android');
    console.log('  $ cordova build && cordova emulate');
};

// On unknown exceptions, output a user-friendly message instead of a stacktrace

process.on('uncaughtException', function(e) {
    console.error(e);
    process.exit(1);
});

// Parse the command-line arguments

var command = process.argv[2];
var options = process.argv.slice(3, process.argv.length);

if (!command) {
    help();
}
else if (phonegap.commandExists(command)) {
    try {
        var result = phonegap.command(command, options);
        if (r) {
            console.error(r);
        }
    }
    catch(e) {
        console.error(e);
    }
}
else {
    console.error('PhoneGap does not understand the command:', command);
    console.error('Try help for a list of available commands');
}
