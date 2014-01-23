#!/usr/bin/env node

/*!
 * Module dependencies.
 */

var CLI = require('../lib/cli'),
    argv = require('optimist').boolean('d')
                              .boolean('device')
                              .boolean('e')
                              .boolean('emulator')
                              .boolean('V')
                              .boolean('verbose')
                              .boolean('v')
                              .boolean('version')
                              .boolean('h')
                              .boolean('help')
                              .boolean('autoreload')
                              .default('autoreload', true)
                              .argv;

/*!
 * Run the command-line client.
 */

var cli = new CLI().argv(argv);
