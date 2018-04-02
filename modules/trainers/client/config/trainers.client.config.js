(function () {
  'use strict';

  angular
    .module('trainers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Trainers',
      state: 'trainers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'trainers', {
      title: 'List Trainers',
      state: 'trainers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'trainers', {
      title: 'Create Trainer',
      state: 'trainers.create',
      roles: ['user']
    });
  }
}());
