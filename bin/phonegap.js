#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli');

/*!
 * Run the command-line client.
 */

var cli = new CLI().argv(process.argv);
