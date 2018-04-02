(function () {
  'use strict';

  angular
    .module('childcares')
    .controller('ChildcaresListController', ChildcaresListController);

  ChildcaresListController.$inject = ['ChildcaresService'];

  function ChildcaresListController(ChildcaresService) {
    var vm = this;

    vm.childcares = ChildcaresService.query();
  }
}());
