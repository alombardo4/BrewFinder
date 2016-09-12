/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Zips              ->  index
 * POST    /api/Zips              ->  create
 * GET     /api/Zips/:id          ->  show
 * PUT     /api/Zips/:id          ->  update
 * DELETE  /api/Zips/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Zip = require('./Zip.model');
var fs = require('fs');
var async = require('async');
var parse = require('csv-parse');

exports.getZipInfo = function(req, res) {
	Zip.findOne({zipCode: req.params.zip}).exec(function(err, zip) {
		if(err) console.log(err);
		return res.json(zip);
	});
};

exports.zipsWithinDistance = function(req, res) {
	//find zip

	//lookup max lat, min lat, max lon, min lon

	//find all zips in range

	Zip.findOne({zipCode: req.params.zip}).exec(function(err, zip) {
		var distance = req.params.distance / 2.0;

		//doing some maths to find ew and ns distance
		var latDist = distance * 0.621371 / 110.54;
		var currentLat = zip.latitude;
		var lonDist = distance * 0.621371 / (111.320 * Math.cos(currentLat));
		lonDist = Math.abs(lonDist);
		var maxLat = zip.latitude + latDist;
		var minLat = zip.latitude - latDist;
		var maxLon = zip.longitude + lonDist;
		var minLon = zip.longitude - lonDist;
		//lookup zips within distance
		Zip.find({$and : [
			{latitude: { $gt: minLat, $lt: maxLat}},
			{longitude: { $gt: minLon, $lt: maxLon}},
		]}).exec(function(err, allZips) {
			return res.json(allZips);
		});

	});
};

var parseHelper = function(err, data) {
	console.log(err);
	console.log('data length: ' + data.length);
	var inserted = 0;
	var updated = 0;
	async.eachSeries(data, function(line, callback) {
		if (line[5].toLowerCase().toString() !== 'not acceptable'.toString()) {
			Zip.count({zipCode: line[1]}, function(err, c) {
				if (err) {
					console.log(err);
				}
				if (c > 0) {
					//zip found
					Zip.findOne({zipCode: line[1]}).exec(function(err, zip) {
						//add info
						if (line[5].toLowerCase() === 'primary') {
							zip.primaryCity = line[3];
							zip.latitude = line[6];
							zip.longitude = line[7];
						} else {
							zip.cities.push(line[3]);
						}
						updated++;
						zip.save(function(err) {
							if (err) console.log(err);
							callback();
						});
					});
				} else {
					//zip not found
					var newZip = new Zip();
					newZip.zipCode = line[1];
					newZip.state = line[4];
					if (line[5].toLowerCase() === 'primary') {
						newZip.primaryCity = line[3];
						newZip.latitude = line[6];
						newZip.longitude = line[7];
					} else {
						newZip.cities.push(line[3]);
					}
					inserted++;
					newZip.save(function(err) {
						if (err) console.log(err);
						callback();
					});
				}
			});
			//		RecordNumber0	Zipcode1	ZipCodeType2	City3	State4	LocationType5	Lat6	Long7	Xaxis	Yaxis	Zaxis	WorldRegion	Country	LocationText	Location	Decommisioned	TaxReturnsFiled	EstimatedPopulation	TotalWages	Notes
		} else {
			callback();
		}
	}, function(err) {
		console.log(err);
		//callback here
		console.log('inserted: ' + inserted);
		console.log('updated: ' + updated);
	});
};


exports.importZipsFromJSON = function() {
	fs.readFile('server/api/Zip/zips.json', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
		var zips = JSON.parse(data);
		async.each(zips, function(zip, callback) {
			zip._id = undefined;
			Zip.collection.insert(zip, function(err) {
				callback(err);

			});

		}, function(err) {
			console.log(err);
			console.log('vared ' + zips.length + ' zip codes = require(JSON');
		});

	});
};
