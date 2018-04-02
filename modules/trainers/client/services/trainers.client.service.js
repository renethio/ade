// Trainers service used to communicate Trainers REST endpoints
(function () {
  'use strict';

  angular
    .module('trainers')
    .factory('TrainersService', TrainersService);

  TrainersService.$inject = ['$resource'];

  function TrainersService($resource) {
    return $resource('api/trainers/:trainerId', {
      trainerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
