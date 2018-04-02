(function () {
  'use strict';

  angular
    .module('trainers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('trainers', {
        abstract: true,
        url: '/trainers',
        template: '<ui-view/>'
      })
      .state('trainers.list', {
        url: '',
        templateUrl: 'modules/trainers/client/views/list-trainers.client.view.html',
        controller: 'TrainersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Trainers List'
        }
      })
      .state('trainers.create', {
        url: '/create',
        templateUrl: 'modules/trainers/client/views/form-trainer.client.view.html',
        controller: 'TrainersController',
        controllerAs: 'vm',
        resolve: {
          trainerResolve: newTrainer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Trainers Create'
        }
      })
      .state('trainers.edit', {
        url: '/:trainerId/edit',
        templateUrl: 'modules/trainers/client/views/form-trainer.client.view.html',
        controller: 'TrainersController',
        controllerAs: 'vm',
        resolve: {
          trainerResolve: getTrainer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Trainer {{ trainerResolve.name }}'
        }
      })
      .state('trainers.view', {
        url: '/:trainerId',
        templateUrl: 'modules/trainers/client/views/view-trainer.client.view.html',
        controller: 'TrainersController',
        controllerAs: 'vm',
        resolve: {
          trainerResolve: getTrainer
        },
        data: {
          pageTitle: 'Trainer {{ trainerResolve.name }}'
        }
      });
  }

  getTrainer.$inject = ['$stateParams', 'TrainersService'];

  function getTrainer($stateParams, TrainersService) {
    return TrainersService.get({
      trainerId: $stateParams.trainerId
    }).$promise;
  }

  newTrainer.$inject = ['TrainersService'];

  function newTrainer(TrainersService) {
    return new TrainersService();
  }
}());
