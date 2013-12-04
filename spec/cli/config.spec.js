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
            expect(stdout.mostRecentCall.args[0]).toMatch(/\r?\n\s+config <path>.*\r?\n/i);
        });
    });

    describe('$ phonegap config', function() {
        it('should output usage info', function() {
            cli.argv({ _: ['config'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/usage: [\S]+ config/i);
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

describe('phonegap config <path> [options]', function() {
    beforeEach(function() {
        cli = new CLI();
        spyOn(process.stdout, 'write');
        spyOn(phonegap, 'config');
    });

    describe('$ phonegap config ./my-app', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'] });
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [],
                access: []
            },
            jasmine.any(Function));
        });
		it('should print the preferences of the project', function(){
			cli.argv({ _: ['config', './my-app'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/Preferences/i);
		});
		it('should print the access of the project', function(){
			cli.argv({ _: ['config', './my-app'] });
            expect(stdout.mostRecentCall.args[0]).toMatch(/Access/i);
		});
    });
	
    describe('$ phonegap config ./my-app -p orientation=landscape', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], p:'orientation=landscape'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [{ name:'orientation', value:'landscape'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app --preference orientation=landscape', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], preference:'orientation=landscape'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [{ name:'orientation', value:'landscape'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app -p orientation=landscape -p fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], p:['orientation=landscape', 'fullscreen=false']});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [{ name:'orientation', value:'landscape'}, { name:'fullscreen', value:'false'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app --preference orientation=landscape --preference fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], preference:['orientation=landscape', 'fullscreen=false']});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [{ name:'orientation', value:'landscape'}, { name:'fullscreen', value:'false'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app --preference orientation=landscape -p fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], preference:'orientation=landscape',p:'fullscreen=false'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [{ name:'orientation', value:'landscape'}, { name:'fullscreen', value:'false'}],
                access: []
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app -a "http://myhost.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], a:'http://myhost.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [],
                access: ['http://myhost.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app --access "http://myhost.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], access:'http://myhost.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [],
                access: ['http://myhost.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app -a "http://myhost.com/*" -a "http://example.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], a:['http://myhost.com/*', 'http://example.com/*']});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [],
                access: ['http://myhost.com/*', 'http://example.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app --access orientation=landscape --access fullscreen=false', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], access:['http://myhost.com/*', 'http://example.com/*']});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [],
                access: ['http://myhost.com/*', 'http://example.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app --access "http://myhost.com/*" -a "http://example.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], access:'http://myhost.com/*',a:'http://example.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [],
                access: ['http://myhost.com/*', 'http://example.com/*']
            },
            jasmine.any(Function));
        });
    });
	
	describe('$ phonegap config ./my-app -p orientation=landscape -a "http://example.com/*"', function() {
        it('should try to config the project', function() {
            cli.argv({ _: ['config', './my-app'], p:'orientation=landscape',a:'http://example.com/*'});
            expect(phonegap.config).toHaveBeenCalledWith({
                path: './my-app',
                preference: [{ name:'orientation', value:'landscape'}],
                access: ['http://example.com/*']
            },
            jasmine.any(Function));
        });
	});
});
