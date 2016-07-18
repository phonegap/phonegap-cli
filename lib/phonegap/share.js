var util = require('util');
var Command = require('./util/command');
var dropbox = require('./util/dropbox');
var serve = require('./serve');

/*
 *
 * Shares the app, valid options are
 * 1) dropbox
 * 2) connect.phonegap.com 
 * 
 */

var ShareDefaults = {};

module.exports = {
    create: function(phonegap) {
        return new ShareCommand(phonegap);
    },
    default_settings: ShareDefaults
};

function ShareCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(ShareCommand, Command);

ShareCommand.prototype.run = function(options, callback) {
  options.phonegap = this.phonegap;
  callback = callback || function() {};

  this.execute(options, callback);

  return this.phonegap;
};

ShareCommand.prototype.execute = function(options, callback) {
  if(options.dropbox === true) {
    dropbox.upload();
  }
  else if(options.connect === true) {
    serve.create(options.phonegap)(options);
  } else {
    throw new Error("Only Dropbox and Connect are supported at this time");
  }
}
