(function () {
  'use strict';

  angular
    .module('childcares')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Childcares',
      state: 'childcares',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'childcares', {
      title: 'List Childcares',
      state: 'childcares.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'childcares', {
      title: 'Create Childcare',
      state: 'childcares.create',
      roles: ['user']
    });
  }
}());
