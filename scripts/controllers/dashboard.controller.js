'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:dashboardController
 * @description
 * # dashboardController
 * Controller of the RoyalFood
 */
RoyalFood.controller('dashboardController',	function ($rootScope, $scope, actions, markets, products, stConstant, authService,
                                                         logService, salaryService, financeService, remainService, utilsService) {
        $scope.actions = actions;
        $scope.markets = markets;
        $scope.products = products;

        $scope.logs = [];
        $scope.log = {};
        $scope.salary = {};

        $scope.interval = utilsService.getCurrentMonthInterval();
        var start = $scope.interval.start;
        var end = $scope.interval.end;

        // GET LOGS
        logService.getLogs(start, end).then(function(logs) {
            $scope.logs = logs;
            $scope.info = utilsService.getInfo($scope.logs, $scope.actions, $scope.products);
            $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
                $scope.info.common[stConstant.BUY_ACTION_ID].amount;
        });

        // WATCH INTERVAL
        $scope.$watch('interval', function() {
            if(angular.isUndefined($scope.interval.start) || angular.isUndefined($scope.interval.end)) {
                $scope.interval = utilsService.getCurrentMonthInterval();
            }
            var start = $scope.interval.start;
            var end = $scope.interval.end;
            logService.getLogs(start, end).then(function(logs) {
                $scope.logs = logs;
                $scope.info = utilsService.getInfo($scope.logs, $scope.actions, $scope.products);
                $scope.marketsInfo = utilsService.getProductInfo($scope.logs, $scope.actions, $scope.markets);
                $scope.balance = $scope.info.common[stConstant.SELL_ACTION_ID].amount -
                    $scope.info.common[stConstant.BUY_ACTION_ID].amount;
            });
        }, true);

        // ADD LOG
        $scope.isload = true;
        $scope.addLog = function() {
            $scope.isload = false;
            $scope.log.date = new Date().getTime();
            logService.addLog(angular.copy($scope.log), actions[$scope.log.actionId].coefficient, function() {
                $scope.logs.push($scope.log);
                $scope.info = utilsService.getInfo($scope.logs, $scope.actions, $scope.products);
                var coefficient = ($scope.log.actionId == stConstant.BUY_ACTION_ID) ? 1 : -1;
                $scope.remain[$scope.log.productId] += ($scope.log.quantity * coefficient);
                delete $scope.log.quantity;
                delete $scope.log.price;
                $scope.isload = true;
            });
        };


        // GET SALARY LOGS
        salaryService.getSalaryLogs(start, end).then(function(salaryLogs) {
            $scope.salaryLogs = salaryLogs;
        });

        // ADD SALARY LOG
        $scope.addSalary = function() {
            $scope.salary.date = new Date().getTime();
            salaryService.addSalary(angular.copy($scope.salary), function() {
                $scope.$applyAsync(function() {
                    $scope.salaryLogs.push($scope.salary);
                });
                $scope.salary = {};
            });
        };

        // REMOVE SALARY LOG
        $scope.removeSalary = function(salary) {
            salaryService.removeSalary(salary, function() {
                $scope.$applyAsync(function() {
                    $scope.salaryLogs = $scope.salaryLogs.filter(function(log) {
                        return log.id != salary.id;
                    });
                });
            });
        };

        // GET REMAIN DATA
        remainService.getRemainData().then(function(remain) {
            $scope.remain = remain;
        });

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