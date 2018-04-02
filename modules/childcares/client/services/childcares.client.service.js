// Childcares service used to communicate Childcares REST endpoints
(function () {
  'use strict';

  angular
    .module('childcares')
    .factory('ChildcaresService', ChildcaresService);

  ChildcaresService.$inject = ['$resource'];

  function ChildcaresService($resource) {
    return $resource('api/childcares/:childcareId', {
      childcareId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
