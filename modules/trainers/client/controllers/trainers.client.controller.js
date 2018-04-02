(function () {
  'use strict';

  // Trainers controller
  angular
    .module('trainers')
    .controller('TrainersController', TrainersController);

  TrainersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'trainerResolve'];

  function TrainersController ($scope, $state, $window, Authentication, trainer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.trainer = trainer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Trainer
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.trainer.$remove($state.go('trainers.list'));
      }
    }

    // Save Trainer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.trainerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.trainer._id) {
        vm.trainer.$update(successCallback, errorCallback);
      } else {
        vm.trainer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('trainers.view', {
          trainerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
