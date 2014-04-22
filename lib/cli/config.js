/*!
 * Module dependencies.
 */

var phonegap = require('../main'),
    fs = require('fs');

/**
 * $ phonegap config [key=value [key=value]]
 *
 * Config interface to interact with the config.xml file.
 *
 * Options:
 *
 *   - `argv` {Object} is an optimist object.
 *   - `callback` {Function} is a completion callback.
 *     - `e` {Error} is null unless there was an error.
 */

module.exports = function(argv, callback) {
    // display help on $ phonegap create
    if (argv._.length <= 0) {
        argv._.unshift('help');
        this.argv(argv, callback);
        return;
    }
	
	argv.access = argv.access || [];
	argv.a = argv.a || [];
	if(!(argv.access instanceof Array)) argv.access = [argv.access];
	if(!(argv.a instanceof Array)) argv.a = [argv.a];
	argv.access = argv.access.concat(argv.a);
	
	argv.preference = argv.preference || [];
	argv.p = argv.p || [];
	if(!(argv.preference instanceof Array)) argv.preference = [argv.preference];
	if(!(argv.p instanceof Array)) argv.p = [argv.p];
	argv.preference = argv.preference.concat(argv.p);
	
	// information that might be customizable
    var data = {
		preference: [],
		access: []
    };
	
	// read the access flags from the args
	argv.access.forEach(function(access){
		data.access.push(access);
	});
	
	// read the preference flags from the args
	argv.preference.forEach(function(preference){
		var split = preference.split('=');
		data.preference.push({name:split[0],value:split[1]});
	});
	
	// config the project
    phonegap.config(data, function(e) {
        callback(e);
    });
};
