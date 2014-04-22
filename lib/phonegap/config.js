/*!
 * Module dependencies.
 */

var Command = require('./util/command'),
    cordova = require('cordova'),
    shell = require('shelljs'),
    path = require('path'),
    util = require('util'),
	et = require('elementtree'),
	fs = require('fs');

/*!
 * Command setup.
 */

module.exports = {
    create: function(phonegap) {
        return new ConfigCommand(phonegap);
    }
};

function ConfigCommand(phonegap) {
    return Command.apply(this, arguments);
}

util.inherits(ConfigCommand, Command);

/**
 * Config an existing app
 *
 * Config an app changing existing preferences or adding new preferences or access.
 *
 * Options:
 *
 *   - `options` {Object} is data required to create an app
 *     - `path` {String} is a directory path for the app.
 *     - `preference` {Array} is the application name (default: 'Hello World')
 *     - `access` {Array} is the package name (default: 'com.phonegap.hello-world')
 *   - [`callback`] {Function} is triggered after creating the app.
 *     - `e` {Error} is null unless there is an error.
 *
 * Returns:
 *
 *   {PhoneGap} for chaining.
 */

ConfigCommand.prototype.run = function(options, callback) {
    // require options
    if (!options) throw new Error('requires option parameter');
	if (!options.preference || !(options.preference instanceof Array)) throw new Error('requires option.preference parameter as an Array');
	if (!options.access || !(options.access instanceof Array)) throw new Error('requires option.access parameter as an Array');

    // optional callback
    callback = callback || function() {};

    // validate options
	options.path = path.resolve("www","config.xml");
	
    // config app
    this.execute(options, callback);

    return this.phonegap;
};

/*!
 * Execute.
 */

ConfigCommand.prototype.execute = function(options, callback) {
    // customize default app
    var configs = this.parseElementtreeSync(options.path);
	
	// if there is no preferences and no access to add modify, just iterate and list current ones.
	if(options.preference.length === 0 && options.access.length === 0){
		this.printCurrentPreferences(configs);
	}else{
		configs = this.updatePreferences(options, configs);
		configs = this.updateAccesses(options, configs);
		
		//write the file back
		fs.writeFileSync(options.path, configs.write({indent: 4}), 'utf-8');
	}
	
	callback(null);
};

ConfigCommand.prototype.printCurrentPreferences = function (doc){
	//print out the current values only
	var output = "Preferences\n";
	doc.findall('preference').forEach(function(e){
		output += e.attrib.name+': '+e.attrib.value + "\n";
	});
	output += "\nAccess\n";
	doc.findall('access').forEach(function(e){
		output += 'origin: '+e.attrib.origin + "\n";
	});
	console.log(output);
};

ConfigCommand.prototype.updatePreferences = function (options, doc){
	//apply the new values to the dom object
	options.preference.forEach(function(p){
		//check if the preference exists already
		var pref = doc.find('preference[@name="'+p.name+'"]');
		if(pref){ 
			//update the value
			pref.attrib.value = p.value;
		}else{ 
			//add the new node
			var el = new et.Element('preference');
			el.attrib.name = p.name;
			el.attrib.value = p.value;
			doc.getroot().append(el);
		}
	});
	
	return doc;
};

ConfigCommand.prototype.updateAccesses = function(options, doc){
	options.access.forEach(function(access){
		var acc = doc.find('access[@origin="'+access+'"]');
		if(!acc){ //don't include the same access again
			var el = new et.Element('access');
			el.attrib.origin = access;
			doc.getroot().append(el);
		}
	});
	
	return doc;
};

ConfigCommand.prototype.parseElementtreeSync = function (filename) {
	var contents = fs.readFileSync(filename, 'utf-8');
	if(contents) {
		contents = contents.replace(/^\uFEFF/, ''); //Windows is the BOM
	}
	return new et.ElementTree(et.XML(contents));
};