'use strict';
var _ = require('lodash');
var Store = require('../../api/Store/Store.model');
var Beer = require('../../api/Beer/Beer.model');
var Checkin = require('../../api/Checkin/Checkin.model');
var Locality = require('../../api/Locality/Locality.model');
var CheckinStat = require('./CheckinStat.model');
var StatRun = require('../runner/StatRun.model');
var async = require('async');

var runForLocality = function(locality, daysToLook, callback) {
  // lookup all stores in locality
  var sRun = new StatRun();
  sRun.type = 'checkinStat';
  sRun.runDate = new Date();
  sRun.locality = locality;
  var searchStartDate = new Date();

  if (daysToLook) {
    searchStartDate.setDate(searchStartDate.getDate() - daysToLook);
  } else {
    searchStartDate.setDate(searchStartDate.getDate() - 7);
  }

  sRun.save(function(err, statRun) {
    if (err) return callback(err);

    Store
      .find({ 'location.postalCode' : { $in : locality.zipCodes }})
      .select('-name -description -location')
      .exec(function(err, stores) {
        if (err) return callback(err, null);
        var storeSearch = _.map(stores, function(store) { return store._id; });
        Checkin.aggregate({ $match :
                            {
                              $and :
                                [
                                  { store :
                                    { $in : storeSearch }
                                  },
                                  {
                                    time :
                                    { $gte : searchStartDate }
                                  }
                                ]
                            }
                          },
                          { $group :
                            {
                              _id : '$beer',
                              count : { $sum : 1}
                            }
                          })
                .allowDiskUse(true)
                .sort('count')
                .exec(function(err, beerCounts) {
                  var runDate = new Date();
                  async.each(beerCounts, function(beer, loopCallback) {
                    var checkinStat = new CheckinStat();
                    checkinStat.beer = beer._id;
                    checkinStat.locality = locality;
                    checkinStat.checkinCount = beer.count;
                    checkinStat.statRun = statRun;
                    checkinStat.save(function(err, result) {
                      if (err) return loopCallback(err);
                      else return loopCallback();
                    })
                  }, function(err) {
                    if (err) return callback(err);
                    else return callback();
                  });
                });
  })

      // find all checkins for stores where time is less than daysToLook or 7 days from now
      // count by beer
      // save one checkinstat per beer with just count
    });
}
exports.runCheckinStats = function() {
  Locality.find({}).exec(function(err, result) {
    if (err) return console.log(err);
    _.each(result, function(locality, callback) {
      runForLocality(locality, 7, function(err) {
        if (err) console.log('Error in checkin stats:', err);
        else console.log('Checkin stat run successful for ' + locality.city + ', ' + locality.state);
      });
    });
  });
}
