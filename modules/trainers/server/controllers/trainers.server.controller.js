'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Trainer = mongoose.model('Trainer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Trainer
 */
exports.create = function(req, res) {
  var trainer = new Trainer(req.body);
  trainer.user = req.user;

  trainer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trainer);
    }
  });
};

/**
 * Show the current Trainer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var trainer = req.trainer ? req.trainer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  trainer.isCurrentUserOwner = req.user && trainer.user && trainer.user._id.toString() === req.user._id.toString();

  res.jsonp(trainer);
};

/**
 * Update a Trainer
 */
exports.update = function(req, res) {
  var trainer = req.trainer;

  trainer = _.extend(trainer, req.body);

  trainer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trainer);
    }
  });
};

/**
 * Delete an Trainer
 */
exports.delete = function(req, res) {
  var trainer = req.trainer;

  trainer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trainer);
    }
  });
};

/**
 * List of Trainers
 */
exports.list = function(req, res) {
  Trainer.find().sort('-created').populate('user', 'displayName').exec(function(err, trainers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(trainers);
    }
  });
};

/**
 * Trainer middleware
 */
exports.trainerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Trainer is invalid'
    });
  }

  Trainer.findById(id).populate('user', 'displayName').exec(function (err, trainer) {
    if (err) {
      return next(err);
    } else if (!trainer) {
      return res.status(404).send({
        message: 'No Trainer with that identifier has been found'
      });
    }
    req.trainer = trainer;
    next();
  });
};
