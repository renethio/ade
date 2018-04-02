(function () {
  'use strict';

  angular
    .module('childcares')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('childcares', {
        abstract: true,
        url: '/childcares',
        template: '<ui-view/>'
      })
      .state('childcares.list', {
        url: '',
        templateUrl: 'modules/childcares/client/views/list-childcares.client.view.html',
        controller: 'ChildcaresListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Childcares List'
        }
      })
      .state('childcares.create', {
        url: '/create',
        templateUrl: 'modules/childcares/client/views/form-childcare.client.view.html',
        controller: 'ChildcaresController',
        controllerAs: 'vm',
        resolve: {
          childcareResolve: newChildcare
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Childcares Create'
        }
      })
      .state('childcares.edit', {
        url: '/:childcareId/edit',
        templateUrl: 'modules/childcares/client/views/form-childcare.client.view.html',
        controller: 'ChildcaresController',
        controllerAs: 'vm',
        resolve: {
          childcareResolve: getChildcare
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Childcare {{ childcareResolve.name }}'
        }
      })
      .state('childcares.view', {
        url: '/:childcareId',
        templateUrl: 'modules/childcares/client/views/view-childcare.client.view.html',
        controller: 'ChildcaresController',
        controllerAs: 'vm',
        resolve: {
          childcareResolve: getChildcare
        },
        data: {
          pageTitle: 'Childcare {{ childcareResolve.name }}'
        }
      });
  }

  getChildcare.$inject = ['$stateParams', 'ChildcaresService'];

  function getChildcare($stateParams, ChildcaresService) {
    return ChildcaresService.get({
      childcareId: $stateParams.childcareId
    }).$promise;
  }

  newChildcare.$inject = ['ChildcaresService'];

  function newChildcare(ChildcaresService) {
    return new ChildcaresService();
  }
}());
