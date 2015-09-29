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

        var startMonth = ($scope.currentYear == 2015) ? 8 : 0;
        $scope.months = [];
        for(var i = startMonth; i <= $scope.currentMonth; i++) {
            $scope.months.push(i);
        }

        $scope.interval = utilsService.getMonthInterval($scope.currentYear, $scope.currentMonth);
        var start = $scope.interval.start;
        var end = $scope.interval.end;

        // BALANCE
        financeService.getFinance($scope.currentYear, $scope.currentMonth).then(function(finance) {
            $scope.balance = finance;
        });

        // CURRENT MONTH EXPENSE LOGS
        $scope.expense = {};
        expenseService.getExpenseLogs(start, end).then(function(logs) {
            $scope.expenseLogs = logs;
        });
        $scope.addExpense = function() {
            $scope.expense.date = new Date().getTime();
            expenseService.addExpense($scope.expense, function() {
                $scope.$applyAsync(function() {
                    $scope.expenseLogs.push($scope.expense);
                });

                if(!$scope.yearExpenseLogsMap[$scope.expense.typeId]) {
                    $scope.yearExpenseLogsMap[$scope.expense.typeId] = {};
                    $scope.yearExpenseLogsMap[$scope.expense.typeId][$scope.currentMonth] = 0;
                    $scope.yearExpenseLogsMap[$scope.expense.typeId].common = 0;
                }

                $scope.yearExpenseLogsMap[$scope.expense.typeId][$scope.currentMonth] += $scope.expense.amount;
                $scope.yearExpenseLogsMap[$scope.expense.typeId].common += $scope.expense.amount;
                $scope.expenseCommonAmount += $scope.expense.amount;
                $scope.balance[$scope.currentMonth] -= $scope.expense.amount;
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

                if(!$scope.yearExpenseLogsMap[$scope.expense.typeId]) {
                    $scope.yearExpenseLogsMap[$scope.expense.typeId] = {};
                    $scope.yearExpenseLogsMap[$scope.expense.typeId][$scope.currentMonth] = 0;
                    $scope.yearExpenseLogsMap[$scope.expense.typeId].common = 0;
                }

                $scope.yearExpenseLogsMap[$scope.expense.typeId][$scope.currentMonth] -= $scope.expense.amount;
                $scope.yearExpenseLogsMap[$scope.expense.typeId].common -= $scope.expense.amount;
                $scope.expenseCommonAmount -= $scope.expense.amount;
                $scope.balance[$scope.currentMonth] += $scope.expense.amount;
            });
        };

        // CURRENT MONTH SALARY LOGS
        $scope.salary = {};
        expenseService.getSalaryLogs(start, end).then(function(logs) {
            $scope.salaryLogs = logs;
        });
        $scope.addSalary = function() {
            $scope.salary.date = new Date().getTime();
            expenseService.addSalary($scope.salary, function() {
                $scope.$applyAsync(function() {
                    $scope.salaryLogs.push($scope.salary);
                });

                if(!$scope.salaryCommonAmount[$scope.currentMonth]) {
                    $scope.salaryCommonAmount[$scope.currentMonth] = 0;
                    $scope.salaryCommonAmount.common = 0;
                }

                $scope.salaryCommonAmount[$scope.currentMonth] += $scope.salary.amount;
                $scope.salaryCommonAmount.common += $scope.salary.amount;
                $scope.balance[$scope.currentMonth] -= $scope.salary.amount;
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

                if(!$scope.salaryCommonAmount[$scope.currentMonth]) {
                    $scope.salaryCommonAmount[$scope.currentMonth] = 0;
                    $scope.salaryCommonAmount.common = 0;
                }

                $scope.salaryCommonAmount[$scope.currentMonth] -= $scope.salary.amount;
                $scope.salaryCommonAmount.common -= $scope.salary.amount;
                $scope.balance[$scope.currentMonth] += $scope.salary.amount;
            });
        };

        // CURRENT MONTH INVEST LOGS
        $scope.invest = {};
        investService.getInvestLogs(start, end).then(function(logs) {
            $scope.investLogs = logs;
        });
        $scope.addInvest = function() {
            $scope.invest.date = new Date().getTime();
            investService.addInvest($scope.invest, function() {
                $scope.$applyAsync(function() {
                    $scope.investLogs.push($scope.invest);
                });

                if(!$scope.yearInvestLogsMap[$scope.invest.typeId]) {
                    $scope.yearInvestLogsMap[$scope.invest.typeId] = {};
                    $scope.yearInvestLogsMap[$scope.invest.typeId][$scope.currentMonth] = 0;
                    $scope.yearInvestLogsMap[$scope.invest.typeId].common = 0;
                }

                $scope.yearInvestLogsMap[$scope.invest.typeId][$scope.currentMonth] += $scope.invest.amount;
                $scope.yearInvestLogsMap[$scope.invest.typeId].common += $scope.invest.amount;
                $scope.investCommonAmount[$scope.currentMonth] += $scope.invest.amount;
                $scope.balance[$scope.currentMonth] += $scope.invest.amount;
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

                if(!$scope.yearInvestLogsMap[$scope.invest.typeId]) {
                    $scope.yearInvestLogsMap[$scope.invest.typeId] = {};
                    $scope.yearInvestLogsMap[$scope.invest.typeId][$scope.currentMonth] = 0;
                    $scope.yearInvestLogsMap[$scope.invest.typeId].common = 0;
                }

                $scope.yearInvestLogsMap[$scope.invest.typeId][$scope.currentMonth] -= $scope.invest.amount;
                $scope.yearInvestLogsMap[$scope.invest.typeId].common -= $scope.invest.amount;
                $scope.investCommonAmount[$scope.currentMonth] -= $scope.invest.amount;
                $scope.balance[$scope.currentMonth] -= $scope.invest.amount;
            });
        };


        /**-------------------------------------*/
        /**             YEARLY DATA             */
        /**-------------------------------------*/
        $scope.yearInterval = utilsService.getYearInterval($scope.currentYear);

        logService.getAmountBuySell($scope.yearInterval.start, $scope.yearInterval.end).then(function(result) {
            $scope.amountSell = result.sell;
            $scope.amountBuy = result.buy;
        });
        expenseService.getExpenseLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(logs) {
            $scope.yearExpenseLogsMap = utilsService.groupByWithMonth(logs, 'typeId', 'amount');
            $scope.expenseCommonAmount = utilsService.groupByMonth($scope.yearExpenseLogsMap);

            $scope.yearTaxExpense = $scope.yearExpenseLogsMap[stConstant.TAX_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.TAX_EXPENSE_TYPE_ID].common : 0;
            $scope.yearRealizationExpense = $scope.yearExpenseLogsMap[stConstant.REALIZATION_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.REALIZATION_EXPENSE_TYPE_ID].common : 0;
            $scope.yearAdministrationExpense = $scope.yearExpenseLogsMap[stConstant.ADMINISTRATION_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.ADMINISTRATION_EXPENSE_TYPE_ID].common : 0;
            $scope.yearPreOperationExpense = $scope.yearExpenseLogsMap[stConstant.PRE_OPERATION_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.PRE_OPERATION_EXPENSE_TYPE_ID].common : 0;
            $scope.yearEquipmentServiceExpense = $scope.yearExpenseLogsMap[stConstant.EQUIPMENT_SERVICE_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.EQUIPMENT_SERVICE_EXPENSE_TYPE_ID].common : 0;
            $scope.yearCommunalExpense = $scope.yearExpenseLogsMap[stConstant.COMMUNAL_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.COMMUNAL_EXPENSE_TYPE_ID].common : 0;
            $scope.yearTransportExpense = $scope.yearExpenseLogsMap[stConstant.TRANSPORT_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.TRANSPORT_EXPENSE_TYPE_ID].common : 0;
            $scope.yearPercentExpense = $scope.yearExpenseLogsMap[stConstant.PERCENT_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.PERCENT_EXPENSE_TYPE_ID].common : 0;
            $scope.yearCreditExpense = $scope.yearExpenseLogsMap[stConstant.CREDIT_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.CREDIT_EXPENSE_TYPE_ID].common : 0;
            $scope.yearOtherCreditExpense = $scope.yearExpenseLogsMap[stConstant.OTHER_CREDIT_EXPENSE_TYPE_ID] ?
                $scope.yearExpenseLogsMap[stConstant.OTHER_CREDIT_EXPENSE_TYPE_ID].common : 0;
        });
        investService.getInvestLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(logs) {
            $scope.yearInvestLogsMap = utilsService.groupByWithMonth(logs, 'typeId', 'amount');
            $scope.investCommonAmount = utilsService.groupByMonth($scope.yearInvestLogsMap);
        });
        expenseService.getSalaryLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(logs) {
            $scope.salaryCommonAmount = utilsService.groupSalaryByMonth(logs);
            $scope.yearSalaryCommonAmount = $scope.salaryCommonAmount.common;
        });
        salaryService.getSalaryLogs($scope.yearInterval.start, $scope.yearInterval.end).then(function(salaryLogs) {
            $scope.marketsSalaryAmount = utilsService.groupSalaryByMonth(salaryLogs);
            $scope.yearMarketsSalaryAmount = $scope.marketsSalaryAmount.common;
        });
	}
);