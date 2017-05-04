var fs = require('fs'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    Q = require('q'),
    shell = require('shelljs'),
    getProjectRoot = require('cordova-common').CordovaCheck.findProjectRoot,
    ConfigParser = require('cordova-common').ConfigParser;
/**
 * Given a PhoneGap project, pin Cordova as a dependency. Installation is not verified if dependency already exists.
 *
 * 1) Verify that projectDir is a valid project; get root
 * 2) Create package.json from config.xml if it does not exist
 * 3) If cordova is not a dependency, use npm to install and save it to package.json
 *
 *
 * @param  {Path[String]} projectDir [Path to anywhere within the PhoneGap project being modified]
 * @param  {EventEmitter|False} extEvents   [Used for events emitting. If undefined, 'log' and 'warn' will log to console. If false, will silence logging] (optional)
 * @return {Promise|Error}            [Returns the project root path or a cordova error.]
 */
module.exports.exec = function(projectDir, extEvents) {
    //store existing working directory
    var cwd = process.cwd();
    extEvents = extEvents ? extEvents : ConsoleEmitter(extEvents);
    var PROJECTROOT;
    return Q()
        .then(function() {
            var project = getProjectRoot(projectDir);
            if (!project) {
                return Q.reject(new Error('"' + projectDir + '" ' + 'does not point to a valid PhoneGap project'));
            } else {
                PROJECTROOT = project;
                return project;
            }
        }).then(function(projectRoot) {
            //change current working directory
            shell.cd(projectRoot);
            var config,
                pkgJson,
                pkgJsonPath = path.resolve(projectRoot, 'package.json');

            if (!fs.existsSync(pkgJsonPath)) {
                extEvents.emit('warn', 'No package.json was found for your project. Creating one from config.xml');
                config = new ConfigParser(path.resolve(projectRoot, 'config.xml'));
                pkgJson = {};
                if (config.name()) {
                    pkgJson.displayName = config.name();
                }
                // Pkjson.name should equal config's id.
                if(config.packageName()) {
                    pkgJson.name = config.packageName().toLowerCase();
                } else if(!config.id()) {
                    pkgJson.name = path.basename(projectRoot).toLowerCase().replace(' ', '') || 'helloworld';
                }

                pkgJson.version = config.version() || '1.0.0';
                fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 4), 'utf8');
            }
            return pkgJsonPath;
        }).then(function(pkgJsonPath) {
            pkgJson =  path.relative(__dirname, pkgJsonPath);
            pkgJson = require(pkgJson);

            //Does not have cordova dependency in package.json
            if (!pkgJson.dependencies || !pkgJson.dependencies.hasOwnProperty('cordova')) {
                if (!shell.which('npm')) {
                    return Q.reject(new Error('"npm" command line tool is not installed: make sure it is accessible on your PATH.'));
                }
                var deferred = Q.defer();
                // Find the latest version of Cordova published and install it
                var cordovaCommand = 'npm install cordova --save';
                extEvents.emit('log', 'Adding Cordova dependency with: "' + cordovaCommand + '"');
                extEvents.emit('log', 'This may take a few minutes ...');
                var child = shell.exec(cordovaCommand, {
                    silent: true
                }, function(code, stdout, stderr) {
                    if (code != 0) {
                        e = new Error('Error from npm: ' + stdout.replace('\n', ''));
                        e.exitCode = code;
                        deferred.reject(e);
                    } else {
                        extEvents.emit('verbose', 'Project is using Cordova ' + stdout.replace('\n', ''));
                        deferred.resolve(stdout.replace('\n', ''));
                    }
                });
                child.stdout.on('data', function(data) {});
                child.stderr.on('data', function(data) {});
                return deferred.promise;
            } else {
                extEvents.emit('verbose', 'Found Cordova dependency in package.json');
            }
        }).then(function() {
            //reset current working directory
            shell.cd(cwd);
            return PROJECTROOT;
        });
};

function ConsoleEmitter(arg) {
    if (arg != false) {
        var emitter = new EventEmitter();
        emitter.on('log', function(msg) {
            console.log('[LOG]: ' + msg);
        });
        emitter.on('warn', function(msg) {
            console.log('[WARN]: ' + msg);
        });
    }
    return emitter;
}
