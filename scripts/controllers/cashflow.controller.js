'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:cashFlowController
 * @description
 * # cashFlowController
 * Controller of the RoyalFood
 */
RoyalFood.controller('cashFlowController', function($scope, logService, cashService, utilsService) {

        logService.getAmountBuy(new Date(2015, 0, 1), new Date(2020, 0, 1)).then(function(amountBuy) {
            $scope.amountBuy = amountBuy;
        });

        // GET CASH LOGS
        cashService.getCashLogs().then(function(logs) {
            $scope.cashLogs = logs;
            $scope.cashCommonAmount = utilsService.sumBy(logs, 'amount');
        });

        // ADD CASH LOG
        $scope.cash = {};
        $scope.addCash = function() {
            $scope.cash.date = new Date().getTime();
            cashService.addCash(angular.copy($scope.cash), function() {
                $scope.$applyAsync(function() {
                    $scope.cashLogs.push($scope.cash);
                });
                $scope.cashCommonAmount += $scope.cash.amount;
                $scope.cash = {};
            });
        };

        // REMOVE CASH LOG
        $scope.removeCash = function(cash) {
            cashService.removeCash(cash, function() {
                $scope.$applyAsync(function() {
                    $scope.cashLogs = $scope.cashLogs.filter(function(log) {
                        return log.id != cash.id;
                    });
                });

                $scope.cashCommonAmount -= cash.amount;
            });
        };

        // TABS
        $scope.selectedIndex = 0;
        $scope.nextTab = function() {
            $scope.selectedIndex += 1;
        };
        $scope.prevTab = function() {
            if($scope.selectedIndex != 0) {
                $scope.selectedIndex -= 1;
            }
        };
	}
);