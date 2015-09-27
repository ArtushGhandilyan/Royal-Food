'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:loginController
 * @description
 * # loginController
 * Controller of the RoyalFood
 */
RoyalFood.controller('loginController',
	function ($scope, $location, authService) {
		$scope.credentials = {};

		$scope.login = function() {
			authService.login($scope.credentials);
		};

        if(authService.isAuthenticated()) {
            $location.path('/dashboard');
        }
	}
);