/**
 * Checkin model events
 */

'use strict';

import {EventEmitter} from 'events';
var Checkin = require('./Checkin.model');
var CheckinEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CheckinEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Checkin.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    CheckinEvents.emit(event + ':' + doc._id, doc);
    CheckinEvents.emit(event, doc);
  }
}

export default CheckinEvents;
