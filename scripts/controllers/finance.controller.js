'use strict';

/**
 * @ngdoc function
 * @name RoyalFood.controller:financeController
 * @description
 * # financeController
 * Controller of the RoyalFood
 */
RoyalFood.controller('financeController', function ($scope, stConstant,
                                                    actions, markets, products, workers, expenseTypes, investTypes,
                                                    expenseService, salaryService, logService, utilsService, financeService, investService) {
        $scope.actions = actions;
        $scope.markets = markets;
        $scope.products = products;

        $scope.workers = workers;
        $scope.expenseTypes = expenseTypes;
        $scope.investTypes = investTypes;

        $scope.currentMonth = new Date().getMonth();
        $scope.currentYear = new Date().getFullYear();

        $scope.data[$scope.currentMonth] = {};

        $scope.interval = utilsService.getMonthInterval($scope.currentYear, $scope.currentMonth);
        var start = $scope.interval.start;
        var end = $scope.interval.end;

        // BALANCE
        financeService.getFinance($scope.currentYear, $scope.currentMonth).then(function(finance) {
            $scope.startBalance = finance.start;
            $scope.endBalance = finance.end;
        });

        // AMOUNT SELL
        logService.getAmountSell(start, end).then(function(amountSell) {
            $scope.amountSell = amountSell;
        });

        // AMOUNT BUY
        logService.getAmountBuy(start, end).then(function(amountBuy) {
            $scope.amountBuy = amountBuy;
        });

        // MARKETS SALARY
        salaryService.getSalaryLogs(start, end).then(function(salaryLogs) {
            $scope.marketsSalaryAmount = utilsService.sumBy(salaryLogs, 'amount');
        });

        // EXPENSE
        $scope.expense = {};
        expenseService.getExpenseLogs(start, end).then(function(logs) {
            $scope.expenseLogs = logs;
            $scope.expenseLogsMap = utilsService.groupBy(logs, 'typeId', 'amount');
            $scope.expenseCommonAmount = utilsService.sumBy(logs, 'amount');
        });
        $scope.addExpense = function() {
            $scope.expense.date = new Date().getTime();
            expenseService.addExpense($scope.expense, function() {
                $scope.$applyAsync(function() {
                    $scope.expenseLogs.push($scope.expense);
                });

                if(!$scope.expenseLogsMap[$scope.expense.typeId]) {
                    $scope.expenseLogsMap[$scope.expense.typeId] = 0;
                }
                $scope.expenseLogsMap[$scope.expense.typeId] += $scope.expense.amount;
                $scope.expenseCommonAmount += $scope.expense.amount;
                $scope.endBalance -= $scope.expense.amount;
                $scope.expense = {};
            });
        };
        $scope.removeExpense = function(expense) {
            expenseService.removeExpense(expense, function() {
                $scope.$applyAsync(function() {
                    $scope.expenseLogs = $scope.expenseLogs.filter(function(log) {
                        return log.id != expense.id;
                    });
                });

                if(!$scope.expenseLogsMap[expense.typeId]) {
                    $scope.expenseLogsMap[expense.typeId] = 0;
                }

                $scope.expenseLogsMap[expense.typeId] -= expense.amount;
                $scope.expenseCommonAmount -= expense.amount;
                $scope.endBalance += expense.amount;
            });
        };

        // SALARY
        $scope.salary = {};
        expenseService.getSalaryLogs(start, end).then(function(logs) {
            $scope.salaryLogs = logs;
            $scope.salaryLogsMap = utilsService.groupBy(logs, 'workerId', 'amount');
            $scope.salaryCommonAmount = utilsService.sumBy(logs, 'amount');
        });
        $scope.addSalary = function() {
            $scope.salary.date = new Date().getTime();
            expenseService.addSalary($scope.salary, function() {
                $scope.$applyAsync(function() {
                    $scope.salaryLogs.push($scope.salary);
                });

                if(!$scope.salaryLogsMap[$scope.salary.workerId]) {
                    $scope.salaryLogsMap[$scope.salary.workerId] = 0;
                }
                $scope.salaryLogsMap[$scope.salary.workerId] += $scope.salary.amount;
                $scope.salaryCommonAmount += $scope.salary.amount;
                $scope.endBalance -= $scope.salary.amount;
                $scope.salary = {};
            });
        };
        $scope.removeSalary = function(salary) {
            expenseService.removeSalary(salary, function() {
                $scope.$applyAsync(function() {
                    $scope.salaryLogs = $scope.salaryLogs.filter(function(log) {
                        return log.id != salary.id;
                    });
                });

                if(!$scope.salaryLogsMap[salary.workerId]) {
                    $scope.salaryLogsMap[salary.workerId] = 0;
                }

                $scope.salaryLogsMap[salary.workerId] -= salary.amount;
                $scope.salaryCommonAmount -= salary.amount;
                $scope.endBalance += salary.amount;
            });
        };

        // INVEST
        $scope.invest = {};
        investService.getInvestLogs(start, end).then(function(logs) {
            $scope.investLogs = logs;
            $scope.investLogsMap = utilsService.groupBy(logs, 'typeId', 'amount');
            $scope.investCommonAmount = utilsService.sumBy(logs, 'amount');
        });
        $scope.addInvest = function() {
            $scope.invest.date = new Date().getTime();
            investService.addInvest($scope.invest, function() {
                $scope.$applyAsync(function() {
                    $scope.investLogs.push($scope.invest);
                });

                if(!$scope.investLogsMap[$scope.invest.typeId]) {
                    $scope.investLogsMap[$scope.invest.typeId] = 0;
                }

                $scope.investLogsMap[$scope.invest.typeId] += $scope.invest.amount;
                $scope.investCommonAmount += $scope.invest.amount;
                $scope.endBalance += $scope.invest.amount;
                $scope.invest = {};
            });
        };
        $scope.removeInvest = function(invest) {
            investService.removeInvest(invest, function() {
                $scope.$applyAsync(function() {
                    $scope.investLogs = $scope.investLogs.filter(function(log) {
                        return log.id != invest.id;
                    });
                });

                if(!$scope.investLogsMap[invest.typeId]) {
                    $scope.investLogsMap[invest.typeId] = 0;
                }

                $scope.investLogsMap[invest.typeId] -= invest.amount;
                $scope.investCommonAmount -= invest.amount;
                $scope.endBalance -= invest.amount;
            });
        };


        /**-------------------------------------*/
        /**     YEARLY DATA FOR SECOND TAB      */
        /**-------------------------------------*/
        $scope.yearInterval = utilsService.getYearInterval($scope.currentYear);
        logService.getAmountSell($scope.yearInterval.start, $scope.yearInterval.end).then(function(amountSell) {
            $scope.yearAmountSell = amountSell;
        });
        logService.getAmountBuy($scope.yearInterval.start, $scope.yearInterval.end).then(function(amountBuy) {
            $scope.yearAmountBuy = amountBuy;
        });
        expenseService.getExpenseLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(logs) {
            $scope.yearExpenseLogsMap = utilsService.groupBy(logs, 'typeId', 'amount');

            $scope.yearTaxExpense = $scope.yearExpenseLogsMap[stConstant.TAX_EXPENSE_TYPE_ID] || 0;
            $scope.yearRealizationExpense = $scope.yearExpenseLogsMap[stConstant.REALIZATION_EXPENSE_TYPE_ID] || 0;
            $scope.yearAdministrationExpense = $scope.yearExpenseLogsMap[stConstant.ADMINISTRATION_EXPENSE_TYPE_ID] || 0;
            $scope.yearPreOperationExpense = $scope.yearExpenseLogsMap[stConstant.PRE_OPERATION_EXPENSE_TYPE_ID] || 0;
            $scope.yearEquipmentServiceExpense = $scope.yearExpenseLogsMap[stConstant.EQUIPMENT_SERVICE_EXPENSE_TYPE_ID] || 0;
            $scope.yearCommunalExpense = $scope.yearExpenseLogsMap[stConstant.COMMUNAL_EXPENSE_TYPE_ID] || 0;
            $scope.yearTransportExpense = $scope.yearExpenseLogsMap[stConstant.TRANSPORT_EXPENSE_TYPE_ID] || 0;
            $scope.yearPercentExpense = $scope.yearExpenseLogsMap[stConstant.PERCENT_EXPENSE_TYPE_ID] || 0;
            $scope.yearCreditExpense = $scope.yearExpenseLogsMap[stConstant.CREDIT_EXPENSE_TYPE_ID] || 0;
            $scope.yearOtherCreditExpense = $scope.yearExpenseLogsMap[stConstant.OTHER_CREDIT_EXPENSE_TYPE_ID] || 0;
        });
        expenseService.getSalaryLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(logs) {
            $scope.yearSalaryCommonAmount = utilsService.sumBy(logs, 'amount');
        });
        salaryService.getSalaryLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(salaryLogs) {
            $scope.yearMarketsSalaryAmount = utilsService.sumBy(salaryLogs, 'amount');
        });
	}
);