/*
command: phonegap tracking

when: user has opted in
result: outputs message "Tracking is enabled! Nice, you are helping us make phonegap tooling better."
"If you would like to turn tracking off, simply run `phonegap tracking off`

when: user has opted out
result: outputs message "Tracking is off. If you would like to enable tracking simply run `phonegap tracking on`"

when: user has not specified anything yet
result: user is presented with y/n option to explicitely turn it on or off

commands:
phonegap tracking reset|on|off
*/

var Insight = require('insight');
var insight = new Insight({
    // Google Analytics tracking code
    "trackingCode": 'UA-94271-37',
    "pkg": require('../../package.json')
});

var category = "phonegap@" + require('../../package.json').version;

var PromptPreamble = "\nHow you use PhoneGap provides us with important data that we can use to make\n" +
                     "our products better. Please read our privacy policy for more information on the\n" +
                     "data we collect. http://www.adobe.com/privacy.html";
var PromptMessage = "Would you like to allow PhoneGap to collect anonymous usage data?";
var UserAcceptedMessage = "\nThank you for helping to make PhoneGap better.\n";
var UserDeclinedMessage = "\nYou have opted out of tracking. To change this, run: `phonegap tracking on`\n";
var TrackingOffMessage  = "\nTracking is off. \nIf you would like to turn tracking on, simply run `phonegap tracking on`\n";
var TrackingOnMessage  = "\nTracking is on! Nice, you are helping us improve PhoneGap tooling.\n" +
                         "If you would like to turn tracking off, simply run `phonegap tracking off`\n";



module.exports = function tracking(argv, callback) {

    var params = argv._.slice(1);

    if (params.length > 0) {
        switch(params[0]) {
            case "on" :
                // only track it if the value is changing
                if (insight.optOut !== false) {
                    // must change it before we use it
                    insight.optOut = false;
                    insight.trackEvent({"category":category,
                                        "action":"set tracking",
                                        "label":"opt in"});
                }
                break;
            case "off" :
                // track it only if it changes
                if (insight.optOut !== true) {
                    // must use it before we change it
                    insight.trackEvent({"category":category,
                                        "action":"set tracking",
                                        "label":"opt out"});
                    insight.optOut = true;
                }
                break;
            case "reset" :
                // this is a secret api, mainly just for testing the prompt messages
                console.log("resetting it .. ");
                insight.optOut = undefined;
                // intentional fallthrough!
            default:
                // unrecognized param
                insight.trackEvent({"category":category,
                                    "action":"set tracking",
                                    "label":"unrecognized param"});
                break;
        }
    }

    if (insight.optOut === undefined) {

    }
    else {
        // somewhat confusing tri-state, it could be true|false|undefined
        if (insight.optOut) {
            console.log(TrackingOffMessage);
        }
        else {
            console.log(TrackingOnMessage);
        }
    }
    callback();
};



module.exports.prompt = function prompt(callback) {

    console.log(PromptPreamble);

    insight.askPermission(PromptMessage,function(error,optIn) {
        if (optIn) {
            // user has accepted, we will thank them and track this
            insight.trackEvent({"category":category,
                                "action":"tracking-prompt",
                                "label":"accepted"});
            console.log(TrackingOnMessage);
        }
        else {
            // user has declined, we still want to track this
            insight.optOut = false;
            insight.trackEvent({"category":category,
                                "action":"tracking-prompt",
                                "label":"declined"});
            insight.optOut = true;
            console.log(TrackingOffMessage);
        }
        callback();
    });
};

module.exports.statusUnknown = function statusUnknown() {
    return insight.optOut === undefined;
};

module.exports.track = function track() {
    if (insight.optOut === false) {
        var args = Array.prototype.slice.call(arguments);
        insight.track.apply(insight, args);
    }
};

module.exports.trackEvent = function trackEvent(category,action,label,value) {
    if (insight.optOut === false) {
        label = label || " ";
        value = value || 0;
        insight.trackEvent({"category":category,
                            "action":action,
                            "label":label,
                            "value":value});
    }
};
