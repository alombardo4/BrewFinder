/**
 * Store model events
 */

'use strict';

import {EventEmitter} from 'events';
var Store = require('./Store.model');
var StoreEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StoreEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Store.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    StoreEvents.emit(event + ':' + doc._id, doc);
    StoreEvents.emit(event, doc);
  }
}

export default StoreEvents;
