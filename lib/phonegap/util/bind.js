/**
 * Bind All.
 *
 * Binds all methods from one object to another.
 *
 * Options:
 *
 *   - `source` {Object} is the source object to use.
 *   - `destination` {Object} has source methods mapped to it.
 */

module.exports = function(source, destination) {
    for(var key in source) {
        bind(key, source, destination);
    }
};

function bind(key, source, destination) {
    destination[key] = function() {
        source[key].apply(source, arguments);
    };
}
