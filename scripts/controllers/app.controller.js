'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:appController
 * @description
 * # appController
 * Controller of the RoyalFood
 */
RoyalFood.controller('appController',
	function ($scope, $mdSidenav, $window, $mdUtil, $mdMedia, $location, authService) {
        $scope.toggleLeft = function() {
            $mdSidenav('left').toggle();
        };
        $scope.toggleRight = function() {
            $mdSidenav('right').toggle();
        };

        $scope.navigateTo = function(page) {
            $location.path('/' + page);
            $mdSidenav('left').close();
        };

        $scope.menuClass = function(page) {
            var current = $location.path().substring(1);
            return page === current ? "active" : "";
        };

		$scope.logout = function() {
			authService.logout();
            $mdSidenav('left').close();
            $location.path('/login');
		};

        $scope.isAuthenticated = function() {
            return authService.isAuthenticated();
        };
	}
);