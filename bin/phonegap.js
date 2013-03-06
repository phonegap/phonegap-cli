#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli'),
    argv = require('optimist').argv;

/*!
 * Run the command-line client.
 */

var cli = new CLI().argv(argv);
