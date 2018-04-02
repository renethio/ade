(function () {
  'use strict';

  // Childcares controller
  angular
    .module('childcares')
    .controller('ChildcaresController', ChildcaresController);

  ChildcaresController.$inject = ['$scope', '$state', '$window', 'Authentication', 'childcareResolve'];

  function ChildcaresController ($scope, $state, $window, Authentication, childcare) {
    var vm = this;

    vm.authentication = Authentication;
    vm.childcare = childcare;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Childcare
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.childcare.$remove($state.go('childcares.list'));
      }
    }

    // Save Childcare
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.childcareForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.childcare._id) {
        vm.childcare.$update(successCallback, errorCallback);
      } else {
        vm.childcare.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('childcares.view', {
          childcareId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
