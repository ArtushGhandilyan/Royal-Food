'use strict';

/**
 * @ngdoc directive
 * @name RoyalFood.directive:productDetails
 * @description
 * # productDetails
 */
RoyalFood.directive('productDetails', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/elements/product-details.html'
    };
});