/*
 * Module dependencies.
 */

var opener = require('opener');

/**
 * Export opener in a way that we can test using `spyOn`.
 */

module.exports.open = opener;
