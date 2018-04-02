'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Childcare = mongoose.model('Childcare'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Childcare
 */
exports.create = function(req, res) {
  var childcare = new Childcare(req.body);
  childcare.user = req.user;

  childcare.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(childcare);
    }
  });
};

/**
 * Show the current Childcare
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var childcare = req.childcare ? req.childcare.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  childcare.isCurrentUserOwner = req.user && childcare.user && childcare.user._id.toString() === req.user._id.toString();

  res.jsonp(childcare);
};

/**
 * Update a Childcare
 */
exports.update = function(req, res) {
  var childcare = req.childcare;

  childcare = _.extend(childcare, req.body);

  childcare.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(childcare);
    }
  });
};

/**
 * Delete an Childcare
 */
exports.delete = function(req, res) {
  var childcare = req.childcare;

  childcare.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(childcare);
    }
  });
};

/**
 * List of Childcares
 */
exports.list = function(req, res) {
  Childcare.find().sort('-created').populate('user', 'displayName').exec(function(err, childcares) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(childcares);
    }
  });
};

/**
 * Childcare middleware
 */
exports.childcareByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Childcare is invalid'
    });
  }

  Childcare.findById(id).populate('user', 'displayName').exec(function (err, childcare) {
    if (err) {
      return next(err);
    } else if (!childcare) {
      return res.status(404).send({
        message: 'No Childcare with that identifier has been found'
      });
    }
    req.childcare = childcare;
    next();
  });
};
