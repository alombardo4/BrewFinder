'use strict';
var _ = require('lodash');
var Store = require('../../api/Store/Store.model');
var Beer = require('../../api/Beer/Beer.model');
var Checkin = require('../../api/Checkin/Checkin.model');
var Locality = require('../../api/Locality/Locality.model');
var TopUserStat = require('./TopUsers.model');
var StatRun = require('../runner/StatRun.model');
var async = require('async');

var runForLocality = function(locality, callback) {
  // lookup all stores in locality
  var sRun = new StatRun();
  sRun.type = 'topUserStat';
  sRun.runDate = new Date();
  sRun.locality = locality;

  sRun.save(function(err, statRun) {
    if (err) return callback(err);

    Store
      .find({ 'location.postalCode' : { $in : locality.zipCodes }})
      .select('-name -description -location')
      .exec(function(err, stores) {
        if (err) return callback(err, null);
        var storeSearch = _.map(stores, function(store) { return store._id; });
        Checkin.aggregate({ $match :
                            { store :
                              { $in : storeSearch }
                            }
                          },
                          { $group :
                            {
                              _id : '$user',
                              count : { $sum : 1}
                            }
                          })
                .allowDiskUse(true)
                .sort('count')
                .exec(function(err, userCounts) {
                  async.each(userCounts, function(user, loopCallback) {
                    var topUserStat = new TopUserStat();
                    topUserStat.user = user._id;
                    topUserStat.locality = locality;
                    topUserStat.checkinCount = user.count;
                    topUserStat.statRun = statRun;
                    topUserStat.save(function(err, result) {
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
exports.runTopUserStat = function() {
  Locality.find({}).exec(function(err, result) {
    if (err) return console.log(err);
    _.each(result, function(locality, callback) {
      runForLocality(locality, function(err) {
        if (err) console.log('Error in top user stats:', err);
        else console.log('Top user stat run successful for ' + locality.city + ', ' + locality.state);
      });
    });
  });
}
