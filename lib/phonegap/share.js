var util = require('util');
var path = require('path');
var Command = require('./util/command');
var dropbox = require('./util/dropbox');
var proxy = require('./util/connect-proxy');
var serve = require('./serve');
var cordova = require('../cordova').cordova;

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
    if (options.dropbox === true) {
        dropbox.upload();
    } else if (options.connect === true) {
        serve.create(options.phonegap)(options);
    } else {
        var projectRootPath = require('../cordova').util.isCordova();
        if (projectRootPath === false) {
            throw new Error("This is not a phonegap project");
        }
        cordova.prepare({
            verbose: true,
            platforms: ["browser"]
        }, function(err, data) {
            dropbox.createZipArchive(path.join(projectRootPath, "platforms/browser/www")).then((archive) => {
                proxy.uploadStatic(archive, {});
            }, (err) => {
                console.log(err);
            });
        });
    }
};
