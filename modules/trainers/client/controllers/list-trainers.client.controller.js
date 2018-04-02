(function () {
  'use strict';

  angular
    .module('trainers')
    .controller('TrainersListController', TrainersListController);

  TrainersListController.$inject = ['TrainersService'];

  function TrainersListController(TrainersService) {
    var vm = this;

    vm.trainers = TrainersService.query();
  }
}());
