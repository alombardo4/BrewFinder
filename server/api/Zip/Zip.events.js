/**
 * Zip model events
 */

'use strict';

import {EventEmitter} from 'events';
var Zip = require('./Zip.model');
var ZipEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ZipEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Zip.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ZipEvents.emit(event + ':' + doc._id, doc);
    ZipEvents.emit(event, doc);
  }
}

export default ZipEvents;
