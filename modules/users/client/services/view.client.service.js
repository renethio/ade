(function () {
  'use strict';

  angular
    .module('users')
    .factory('usersService', usersService);

  usersService.$inject = [/*Example: '$state', '$window' */];

  function usersService(/*Example: $state, $window */) {
    // View service logic
    // ...

    // Public API
    return {
      someMethod: function () {
        return true;
      }
    };
  }
})();
