/*!
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');

/*!
 * Global constants.
 */

var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

/**
 * Change Process to Project Root.
 *
 * Options:
 *
 *   - `delegate` {Object} error delegate.
 *     - `emitter` {EventEmitter} will emit an `error` event on error.
 *     - `callback` {Function} will be called on an error.
 *       - `e` {Error} describes the error.
 *
 * Returns:
 *
 *   - `null` {Object} if the project root is not found.
 *   - `path` {String} is the full path to the project root.
 */

module.exports.cd = function(delegate) {
    var currentPath = process.cwd();

    // is the current working directory the PhoneGap project?
    if (module.exports.isProject(currentPath)) {
        return currentPath;
    }

    // if not, step back a directory
    process.chdir(path.join(currentPath, '..'));

    // recursively try again, unless we're not at the system root (/ or C:/ or whatever)
    if (process.cwd() !== currentPath) {
        return module.exports.cd(delegate);
    }

    // notify delegate of error because we are at the system root
    var e = new Error('project directory could not be found');
    delegate.emitter.emit('error', e);
    delegate.callback(e);

    return null;
};

/**
 * Check Path to be a Cordova Project.
 *
 * Options:
 *
 *   - `projectPath` {String} is path checked.
 *
 * Returns:
 *
 *   - {Boolean} true if valid Cordova project.
 */

module.exports.isProject = function(projectPath) {
    var cordovaPath = path.join(projectPath, '.cordova');

    return (fs.existsSync(cordovaPath) &&
            !module.exports.isHome(projectPath));
};

/**
 * Check Path to be User Home Directory.
 *
 * Options:
 *
 *   - `homePath` {String} is path checked.
 *
 * Returns:
 *
 *   - {Boolean} true if path is user's home directory.
 */

module.exports.isHome = function(homePath) {
    return (homePath === HOME);
};
