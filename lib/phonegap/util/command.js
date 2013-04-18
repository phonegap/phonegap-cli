/**
 * Base Command.
 *
 * > All your base are belong to us.
 *
 * All commands should inherit from the base `Command` object.
 *
 * This object handles the dependency injection of the `phonegap` object.
 *
 * This has two major benefits:
 *   1. Allows `PhoneGap` to create instances. This is helpful for testing.
 *   2. Allows test framework to mock public interfaces during tests.
 *
 * Options:
 *
 *   - `phonegap` {Object} is the instance of `PhoneGap` for this command.
 *
 * Returns:
 *
 *   {Function} that will call the inheriting class' `run` function.
 */

function Command(phonegap) {
    this.phonegap = phonegap;

    var self = this;
    return function() {
        return self.run.apply(self, arguments);
    };
}

Command.prototype.run = function(options, callback) {
    // subclasses should override this function
};

/*!
 * Expose module.
 */

module.exports = Command;
