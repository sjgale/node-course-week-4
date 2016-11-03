var express = require('express');
var bodyParser = require('body-parser');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
	.all(function (req, res, next) {
		res.writeHead(200, { 'Content-Type': 'text/plain' });
		next();
	})
	.get(function (req, res) {
		res.end('Will send all promotions to you!');
	})
	.post(function (req, res) {
		res.end('Will add the promotion: ' + req.body.name + ' with details ' + req.body.description);
	})
	.delete(function (req, res) {
		res.end('Deleting all promotions');
	});

promoRouter.route('/:promoId')
	.all(function (req, res, next) {
		res.writeHead(200, { 'Content-Type': 'text/plain'});
		next();
	})
	.get(function (req, res) {
		res.end('Will send the details of promo: ' + req.params.promoId + ' to you!');
	})
	.put(function (req, res) {
		res.write('Updating the dish: ' + req.params.promoId + '\n');
		res.end('Will update the details of the dish: ' + req.body.name + ' with details: ' + req.body.description);
	})
	.delete(function (req, res) {
		res.end('Deleting dish: ' + req.params.promoId);
	});

module.exports = promoRouter;
