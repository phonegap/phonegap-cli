#!/usr/bin/env node

// Module dependencies.

var fs = require('fs');
var path = require('path');
var phonegap = require('../lib/phonegap');

// Load package.json

var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname,'..','package.json'), 'utf8'));

