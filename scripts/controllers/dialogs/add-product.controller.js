'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:addProductController
 * @description
 * # addProductController
 * Controller of the RoyalFood
 */
RoyalFood.controller('addProductController', function ($scope, $mdDialog) {
    $scope.product = {};

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function() {
        if(angular.isDefined($scope.product.name) &&
            angular.isDefined($scope.product.unit) &&
            angular.isDefined($scope.product.description)) {
            $mdDialog.hide($scope.product);
        }
    };
});