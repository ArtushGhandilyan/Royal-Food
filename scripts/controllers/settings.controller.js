'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:settingsController
 * @description
 * # settingsController
 * Controller of the RoyalFood
 */
RoyalFood.controller('settingsController', function ($scope, $log, $mdDialog, marketService, productService,
                                                     markets, products) {
    $scope.markets = markets;
    $scope.products = products;

    $scope.addMarket = function(event) {
        $mdDialog.show({
            controller: 'addMarketController',
            templateUrl: 'views/elements/dialogs/add-market.dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true
        }).then(function(market) {
            var marketId = marketService.addMarket(market, {products: $scope.products});
            $scope.markets[marketId] = market;
        }, function() {
            $log.info('You cancelled the dialog.');
        });
    };

    $scope.addProduct = function(event) {
        $mdDialog.show({
            controller: 'addProductController',
            templateUrl: 'views/elements/dialogs/add-product.dialog.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose:true
        }).then(function(product) {
            var productId = productService.addProduct(product, {markets: $scope.markets});
            $scope.products[productId] = product;
        }, function() {
            $log.info('You cancelled the dialog.');
        });
    };
});