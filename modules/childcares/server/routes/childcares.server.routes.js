'use strict';

/**
 * Module dependencies
 */
var childcaresPolicy = require('../policies/childcares.server.policy'),
  childcares = require('../controllers/childcares.server.controller');

module.exports = function(app) {
  // Childcares Routes
  app.route('/api/childcares').all(childcaresPolicy.isAllowed)
    .get(childcares.list)
    .post(childcares.create);

  app.route('/api/childcares/:childcareId').all(childcaresPolicy.isAllowed)
    .get(childcares.read)
    .put(childcares.update)
    .delete(childcares.delete);

  // Finish by binding the Childcare middleware
  app.param('childcareId', childcares.childcareByID);
};
