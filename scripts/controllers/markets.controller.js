'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:marketsController
 * @description
 * # marketsController
 * Controller of the RoyalFood
 */
RoyalFood.controller('marketsController', function ($scope, $mdSidenav, stConstant, marketId,
                                                   logService, salaryService, financeService, remainService, utilsService,
                                                   markets, actions, products) {
    $scope.actions = actions;
    $scope.markets = markets;
    $scope.products = products;

    $scope.selectedIndex = 0;
    $scope.nextTab = function() {
        if($scope.selectedIndex != 3) {
            $scope.selectedIndex += 1;
        }
    };
    $scope.prevTab = function() {
        if($scope.selectedIndex != 0) {
            $scope.selectedIndex -= 1;
        }
    };

    $scope.interval = utilsService.getCurrentMonthInterval();

    // market specific data.
    $scope.marketId = marketId || Object.keys($scope.markets)[0];
    $scope.market = $scope.markets[$scope.marketId];

    $scope.logs = [];
    $scope.info = utilsService.getInfo($scope.logs, $scope.actions, $scope.products);
    $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
        $scope.info.common[stConstant.BUY_ACTION_ID].amount;

    $scope.salary = [];
    var start = $scope.interval.start;
    var end = $scope.interval.end;
    salaryService.getMarketSalaryLogs($scope.marketId, start, end).then(function(salaryLogs) {
        $scope.salary = salaryLogs;
    });

    remainService.getMarketRemainData($scope.marketId).then(function(remain) {
        $scope.remain = remain;
    });

    $scope.$watch('interval', function() {
        var marketId = $scope.marketId;

        if(angular.isUndefined($scope.interval.start) || angular.isUndefined($scope.interval.end)) {
            $scope.interval = utilsService.getCurrentMonthInterval();
        }
        var start = $scope.interval.start;
        var end = $scope.interval.end;
        logService.getMarketLogs(marketId, start, end).then(function(logs) {
            $scope.logs = logs;
            $scope.info = utilsService.getInfo($scope.logs, $scope.actions, $scope.products);
            $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
                $scope.info.common[stConstant.BUY_ACTION_ID].amount;
        });
    }, true);

    $scope.details = function(marketId) {
        $scope.marketId = marketId;
        $scope.market = $scope.markets[marketId];

        remainService.getMarketRemainData(marketId).then(function(remain) {
            $scope.remain = remain;
        });

        if(angular.isUndefined($scope.interval.start) || angular.isUndefined($scope.interval.end)) {
            $scope.interval = utilsService.getCurrentMonthInterval();
        }

        var start = $scope.interval.start;
        var end = $scope.interval.end;
        logService.getMarketLogs(marketId, start, end).then(function(logs) {
            $scope.logs = logs;
            $scope.info = utilsService.getInfo($scope.logs, $scope.actions, $scope.products);
            $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
                $scope.info.common[stConstant.BUY_ACTION_ID].amount;
        });

        salaryService.getMarketSalaryLogs(marketId, start, end).then(function(salaryLogs) {
            $scope.salary = salaryLogs;
        });

        $mdSidenav('right').close();
    };
});