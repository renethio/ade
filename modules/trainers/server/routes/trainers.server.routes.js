'use strict';

/**
 * Module dependencies
 */
var trainersPolicy = require('../policies/trainers.server.policy'),
  trainers = require('../controllers/trainers.server.controller');

module.exports = function(app) {
  // Trainers Routes
  app.route('/api/trainers').all(trainersPolicy.isAllowed)
    .get(trainers.list)
    .post(trainers.create);

  app.route('/api/trainers/:trainerId').all(trainersPolicy.isAllowed)
    .get(trainers.read)
    .put(trainers.update)
    .delete(trainers.delete);

  // Finish by binding the Trainer middleware
  app.param('trainerId', trainers.trainerByID);
};
