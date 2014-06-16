#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli'),
    argv = require('minimist')(process.argv.slice(2), {
        boolean: [
            'd', 'device',
            'e', 'emulator',
            'V', 'verbose',
            'v', 'version',
            'h', 'help',
            'autoreload'
        ],
        default: {
            'autoreload': true
        }
    });

/*!
 * Add optimist backward-compatibility.
 */

argv.$0 = require('path').basename(process.argv[1]);

/*!
 * Run the command-line client.
 */

var cli = new CLI().argv(argv);
