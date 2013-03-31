/*!
 * Module dependencies.
 */

var events = require('events');

/*!
 * Expose the global event emitter;
 */

var emitter = new events.EventEmitter();
module.exports = emitter;
