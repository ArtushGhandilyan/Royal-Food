'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:productsController
 * @description
 * # productsController
 * Controller of the RoyalFood
 */
RoyalFood.controller('productsController', function ($scope, $mdSidenav, stConstant, productId,
                                                    logService, salaryService, financeService, remainService, utilsService,
                                                    markets, actions, products) {
    $scope.actions = actions;
    $scope.markets = markets;
    $scope.products = products;

    $scope.selectedIndex = 0;
    $scope.nextTab = function () {
        if ($scope.selectedIndex != 3) {
            $scope.selectedIndex += 1;
        }
    };
    $scope.prevTab = function () {
        if ($scope.selectedIndex != 0) {
            $scope.selectedIndex -= 1;
        }
    };

    $scope.interval = utilsService.getCurrentMonthInterval();

    // market specific data.
    $scope.productId = productId || Object.keys($scope.products)[0];
    $scope.product = $scope.products[$scope.productId];

    $scope.logs = [];
    $scope.info = utilsService.getProductInfo($scope.logs, $scope.actions, $scope.markets);
    $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
        $scope.info.common[stConstant.BUY_ACTION_ID].amount;

    remainService.getProductRemainData($scope.productId).then(function (remain) {
        $scope.remain = remain;
    });

    $scope.$watch('interval', function () {
        var productId = $scope.productId;

        if (angular.isUndefined($scope.interval.start) || angular.isUndefined($scope.interval.end)) {
            $scope.interval = utilsService.getCurrentMonthInterval();
        }
        var start = $scope.interval.start;
        var end = $scope.interval.end;
        logService.getProductLogs(productId, start, end).then(function (logs) {
            $scope.logs = logs;
            $scope.info = utilsService.getProductInfo($scope.logs, $scope.actions, $scope.markets);
            $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
                $scope.info.common[stConstant.BUY_ACTION_ID].amount;
        });
    }, true);

    $scope.details = function (productId) {
        $scope.productId = productId;
        $scope.product = $scope.products[productId];

        remainService.getProductRemainData(productId).then(function (remain) {
            $scope.remain = remain;
        });

        if (angular.isUndefined($scope.interval.start) || angular.isUndefined($scope.interval.end)) {
            $scope.interval = utilsService.getCurrentMonthInterval();
        }

        var start = $scope.interval.start;
        var end = $scope.interval.end;
        logService.getProductLogs(productId, start, end).then(function (logs) {
            $scope.logs = logs;
            $scope.info = utilsService.getProductInfo($scope.logs, $scope.actions, $scope.markets);
            $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
                $scope.info.common[stConstant.BUY_ACTION_ID].amount;
        });

        $mdSidenav('right').close();
    };
});