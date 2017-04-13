/*
command: phonegap analytics

when: user has opted in
result: outputs message "Analytics is enabled! Nice, you are helping us make phonegap tooling better."
"If you would like to turn analytics off, simply run `phonegap analytics off`

when: user has opted out
result: outputs message "Analytics is off. If you would like to enable analytics simply run `phonegap analytics on`"

when: user has not specified anything yet
result: user is presented with y/n option to explicitely turn it on or off

commands:
phonegap analytics reset|on|off
*/

var Insight = require('insight');
var Configstore = require('configstore');
var fs = require('fs');
var path = require('path');
var request = require('request');
var sanitizeArgs = require('./util/sanitize-args');
var os_name = require('os-name');

// Google Analytics tracking code
var trackingCode = 'UA-94271-37'; // this is the default production tracking code

var rootPath = require.resolve('../../package.json');
var gitPath = path.join(path.dirname(rootPath),'.git');
if(fs.existsSync(gitPath)) {
    // set it to the dev tracking code
    trackingCode = 'UA-94271-38';
}
var pkg_json = require('../../package.json');

var insight = new Insight({
    "trackingCode": trackingCode,
    "pkg": pkg_json
});

var PromptPreamble = '\nHow you use PhoneGap provides us with important data that we can use to make\n' +
                     'our products better. Please read our privacy policy for more information on the\n' +
                     'data we collect. http://www.adobe.com/privacy.html';
var PromptMessage = 'Would you like to allow PhoneGap to collect anonymous usage data?';
var AnalyticsOffMessage  = '\nAnalytics is off. \nIf you would like to turn analytics on, simply run `phonegap analytics on`\n';
var AnalyticsOnMessage  = '\nAnalytics is on! Nice, you are helping us improve PhoneGap tooling.\n' +
                         'If you would like to turn analytics off, simply run `phonegap analytics off`\n';

/*
    Helper function to determine if cli is a production/dev release
*/

function getEnvironment(package_json) {
    if(/cordova/.test(package_json.version)) {
        return 1;
    } else {
        return 0;
    }
}


/*
    Helper function to send events to the analytics end point
*/
function sendAnalytics(data) {
    if (!data) return;

    request.post({
        url: 'https://metrics.phonegap.com/gelf',
        form: JSON.stringify(data)
    }, function(err, res, body) {
        // TODO: do we want to report errors to somewhere???
        if (err && err.code == 'ETIMEDOUT') {
            // We had a timeout! oh no.
            if (err.connect) {
                // this was a connection timeout, meaning, we timed out
                // establishing a connection to metrics.phonegap.com
            } else {
                // this was a read timeout, meaning, we timed out waiting for a
                // response from the server
            }
        }
    });
}

module.exports = function analytics(argv, callback) {
    var params = argv._.slice(1);

    if (params.length > 0) {
        switch(params[0].toLowerCase()) {
            case "on" :
                // only track it if the value is changing
                if (insight.optOut !== false) {
                    // must change it before we use it
                    insight.optOut = false;
                    module.exports.trackEvent(argv._);
                }
                break;
            case "off" :
                // track it only if it changes
                if (insight.optOut !== true) {
                    // must use it before we change it
                    module.exports.trackEvent(argv._);
                    insight.optOut = true;
                }
                break;
            case "reset" :
                // this is a secret api, mainly just for testing the prompt messages
                console.log("resetting it .. ");
                insight.optOut = undefined;
                break;
        }
    }
    if (insight.optOut === undefined) {
    } else {
        // somewhat confusing tri-state, it could be true|false|undefined
        if (insight.optOut) {
            console.log(AnalyticsOffMessage);
        }
        else {
            console.log(AnalyticsOnMessage);
        }
    }
    callback();
};

var EVENT_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
module.exports.EVENT_EXPIRY_TIME = EVENT_EXPIRY_TIME;
// Use the same underlying filesystem config object that the `Insight` module
// above uses. This way we hopefully don't litter config objects everywhere.
var config = new Configstore('insight-phonegap');
module.exports.config = config;
/*
    Helper function to help build up GELF formatted json
*/

function basicGELF() {
    var event = {
        "version": "1.1",
        "host": "cli",
        "short_message": "",
        "_userID": insight.clientId,
        "_session": true,
        "_appVersion": pkg_json.version,
        "_nodeVersion": process.version,
        "_platform": os_name(),
        "_env": getEnvironment(pkg_json)
    };
    var now = (new Date()).valueOf(); // in ms
    var lastRun = config.get('lastRun');
    if (lastRun && (now - lastRun < EVENT_EXPIRY_TIME)) {
        // If the CLI ran consecutive actions within the expiry time, use the same session id.
        event["_session"] = lastRun;
    } else {
        event["_session"] = now;
        config.set('lastRun', now);
    }
    return event;
}
module.exports.hasOptedOut = function hasOptedOut() {
    return insight.optOut === true;
};


module.exports.prompt = function prompt(callback) {
    console.log(PromptPreamble);

    insight.askPermission(PromptMessage,function(error,optIn) {
        if (optIn) {
            // user has accepted, we will thank them and track this
            insight.trackEvent({"category":"analytics-prompt",
                                "action":"accepted",
                                "label":""});

            var info = basicGELF();
            info.short_message = "analytics-prompt accepted";
            sendAnalytics(info);

            console.log(AnalyticsOnMessage);
        }
        else {
            // user has declined, we still want to track this
            insight.optOut = false;
            insight.trackEvent({"category":"analytics-prompt",
                                "action":"declined",
                                "label":""});

            var info = basicGELF();
            info.short_message = "analytics-prompt declined";
            sendAnalytics(info);

            insight.optOut = true;
            console.log(AnalyticsOffMessage);
        }
        callback();
    });
};

module.exports.statusUnknown = function statusUnknown() {
    return insight.optOut === undefined;
};

module.exports.trackEvent = function trackEvent(args, error) {
    // if we received an error, then we will exit with an error status
    // if an exit code was attached to the error, then use it
    // otherwise default to 1.
    var exitCode = error ? error.exitCode || 1 : 0;
    var cleanedResult = sanitizeArgs.stringifyForGoogleAnalytics(args);
    var category = cleanedResult.command;
    var action = cleanedResult.params;
    var label = exitCode + "";
    var value = cleanedResult.count;
    if (module.exports.hasOptedOut() === false) {
        if (cleanedResult.command) {
            // If we have a command parsed out, send it off to metrics
            var info = basicGELF();
            info.short_message = sanitizeArgs.getCommand(args);
            info._flags = sanitizeArgs.getSwitches(args);
            info._exitCode = exitCode;
            info._params = sanitizeArgs.filterParameters(args);
            if (error) {
                if (error.stack) info._error_stack = error.stack;
                if (error.output) info._error_msg = error.output;
            }
            sendAnalytics(info);
        }
        category = category || "-";
        action = action || "-";
        label = label || "-";
        value = value || 0;
        insight.trackEvent({"category":category,
                            "action":action,
                            "label":label,
                            "value":value});
    }
};
