/*
 * Module dependencies.
 */

var phonegap = require('../../lib/main'),
    CLI = require('../../lib/cli'),
    cli,
    stdout;

/*
 * Specification: $ phonegap help config
 */

describe('phonegap help config', function() {
	beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        stdout = process.stdout.write;
	});
	
	    describe('$ phonegap help', function() {
        it('should include the command', function() {
            cli.argv({ _: ['help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+config.*\r?\n/i);
        });
    });

    describe('$ phonegap config', function() {
		var originalFs;
		beforeEach(function(){
			var fs = require('fs');
			originalFs = fs.readFileSync;
			fs.readFileSync = function(path, encoding){
				return '<?xml version="1.0" encoding="utf-8"?>\\n\
<widget id="com.spilgames.dev.hello4" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:gap="http://phonegap.com/ns/1.0">\\n\
	<feature name="http://api.phonegap.com/1.0/device" />\\n\
	<preference name="permissions" value="none" />\\n\
	<icon src="icon.png" />\\n\
	<icon gap:density="ldpi" gap:platform="android" src="res/icon/android/icon-36-ldpi.png" />\\n\
	<gap:splash gap:density="ldpi" gap:platform="android" src="res/screen/android/screen-ldpi-portrait.png" />\\n\
	<access origin="http://myhost2.com/*" />\\n\
</widget>';
			};
		});
		
		afterEach(function(){
			var fs = require('fs');
			fs.readFileSync = originalFs;
		});

        it('should print the preferences of the project', function(){
			cli.argv({ _: ['config'] });
			expect(stdout.mostRecentCall.args[0]).toMatch(/Preferences/i);
		});
		it('should print the access of the project', function(){
			cli.argv({ _: ['config'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/Access/i);
		});
    });

    describe('$ phonegap help config', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['help', 'config'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ config/i);
        });
    });

    describe('$ phonegap config help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['config', 'help'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ config/i);
        });
    });

    describe('$ phonegap config --help', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['config'], help: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ config/i);
        });
    });

    describe('$ phonegap config -h', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['config'], h: true });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ config/i);
        });
    });
});

/*
 * Specification: $ phonegap config <path> [options]
 */

describe('phonegap config [options]', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'config');
    });

    describe('$ phonegap config', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'] });
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
    describe('$ phonegap config -p orientation=landscape', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], p:'orientation=landscape'});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [{ name:'orientation', value:'landscape'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config --preference orientation=landscape', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], preference:'orientation=landscape'});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [{ name:'orientation', value:'landscape'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config -p orientation=landscape -p fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], p:['orientation=landscape', 'fullscreen=false']});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [{ name:'orientation', value:'landscape'}, { name:'fullscreen', value:'false'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config --preference orientation=landscape --preference fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], preference:['orientation=landscape', 'fullscreen=false']});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [{ name:'orientation', value:'landscape'}, { name:'fullscreen', value:'false'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config --preference orientation=landscape -p fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], preference:'orientation=landscape',p:'fullscreen=false'});
            expect(phonegap.config).toHaveBeenCalledWith({
				preference: [{ name:'orientation', value:'landscape'}, { name:'fullscreen', value:'false'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config -a "http://myhost.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], a:'http://myhost.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [],
                access: ['http://myhost.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config --access "http://myhost.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], access:'http://myhost.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [],
                access: ['http://myhost.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config -a "http://myhost.com/*" -a "http://example.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], a:['http://myhost.com/*', 'http://example.com/*']});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [],
                access: ['http://myhost.com/*', 'http://example.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config --access orientation=landscape --access fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], access:['http://myhost.com/*', 'http://example.com/*']});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [],
                access: ['http://myhost.com/*', 'http://example.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config --access "http://myhost.com/*" -a "http://example.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], access:'http://myhost.com/*',a:'http://example.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [],
                access: ['http://myhost.com/*', 'http://example.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config -p orientation=landscape -a "http://example.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config'], p:'orientation=landscape',a:'http://example.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                preference: [{ name:'orientation', value:'landscape'}],
                access: ['http://example.com/*']
            },
            jasmine.any(Function));
        });
	});
});
