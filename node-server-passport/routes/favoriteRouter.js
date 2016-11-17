var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
	.all(Verify.verifyOrdinaryUser)
	.get(function (req, res, next) {
		var userID = req.decoded._doc._id;
		
		Favorites.find({"postedBy": userID})
			.populate('postedBy')
			.populate('dishes')
			.exec(function (err, favorite) {
				if (err) throw err;
				res.json(favorite);
			});
	})
	.post(function (req, res, next) {
		var userID = req.decoded._doc._id;
		
		Favorites.find({"postedBy": userID}, function (err, favorite) {
			if (err) throw err;
		
			if (favorite.length) {
				favorite[0].dishes.push(req.body);
				favorite[0].save(function (err, resp) {
					if (err) throw err;
					console.log('Updated favorites!');
					res.json(resp);
				});
			} else {
				//favorites list does not exist
				req.body.postedBy = userID;
				Favorites.create({
					postedBy: userID,
					dishes: req.body
				}, function (err, favorite) {
					if (err) throw err;
					console.log('Favorites created!');
					res.json(favorite);
				});
			}
		});
	})
	.delete(function (req, res, next) {
		var userID = req.decoded._doc._id;
		
		Favorites.remove({"postedBy": userID}, function (err, resp) {
			if (err) throw err;
			res.json(resp);
		});
	});
	
favoriteRouter.route('/:dishObjectId')
	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		var userID = req.decoded._doc._id;
		
		Favorites.find({"postedBy": userID}, function (err, favorite) {
			if (err) throw err;

			favorite[0].dishes = favorite[0].dishes.filter(function (current) {
					return current != req.params.dishObjectId;
				});

			favorite[0].save(function (err, resp) {
				if (err) throw err;
				res.json(resp);
			});
		});
	});
	
module.exports = favoriteRouter;
