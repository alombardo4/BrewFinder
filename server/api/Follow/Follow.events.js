/**
 * Follow model events
 */

'use strict';

import {EventEmitter} from 'events';
var Follow = require('./Follow.model');
var FollowEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FollowEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Follow.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FollowEvents.emit(event + ':' + doc._id, doc);
    FollowEvents.emit(event, doc);
  }
}

export default FollowEvents;
