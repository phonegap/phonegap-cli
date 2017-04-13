/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    util = require('util'),
    fs = require('fs'),
    http = require('http');

/**
 * Server Default Settings
 */
var PushServerDefaults = {
    port: 80,
    host: 'push.api.phonegap.com'
};

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new PushCommand(phonegap);
    },
    default_settings: PushServerDefaults
};

function PushCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(PushCommand, Command);

/**
 * Push.
 *
 */

PushCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');

    // optional parameters
    options.port = options.port || PushServerDefaults.port;
    options.host = options.host || PushServerDefaults.host;
    options.phonegap = this.phonegap;
    callback = callback || function() {};

    // send push
    this.execute(options, callback);

    return this.phonegap;
};
/*!
 * Execute command.
 */

PushCommand.prototype.execute = function(options, callback) {
    if (options.file) {
        var payload = fs.readFileSync(options.file, 'utf8');
        options.payload = payload;
    }

    if (!options.payload) throw new Error('requires payload parameter');

    var data = JSON.stringify({
      'deviceID': options.deviceID,
      'type': options.service,
      'appID': 'com.adobe.phonegap.app',
      'payload': JSON.parse(options.payload)
    });

    var postOptions = {
        host: options.host,
        port: options.port,
        path: '/v1/push',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var req = http.request(postOptions, function(res) {
        //res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
        res.on('error', function (e) {
            console.log("error: " + e);
        });
    });

    req.write(data);
    req.end();
};
