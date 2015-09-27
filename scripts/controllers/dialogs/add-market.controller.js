'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:addMarketController
 * @description
 * # addMarketController
 * Controller of the RoyalFood
 */
RoyalFood.controller('addMarketController', function ($scope, $mdDialog) {
    $scope.market = {};

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function() {
        if(angular.isDefined($scope.market.name) && angular.isDefined($scope.market.address)) {
            $mdDialog.hide({
                name: $scope.market.name,
                address: $scope.market.address,
                manager: angular.isDefined($scope.market.manager) ? $scope.market.manager : null,
                tel: angular.isDefined($scope.market.tel) ? $scope.market.tel : null
            });
        }
    };
});