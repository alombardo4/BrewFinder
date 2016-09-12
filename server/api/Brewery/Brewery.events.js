/**
 * Brewery model events
 */

'use strict';

import {EventEmitter} from 'events';
var Brewery = require('./Brewery.model');
var BreweryEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BreweryEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Brewery.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BreweryEvents.emit(event + ':' + doc._id, doc);
    BreweryEvents.emit(event, doc);
  }
}

export default BreweryEvents;
