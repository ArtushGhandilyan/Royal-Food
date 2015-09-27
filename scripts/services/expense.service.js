'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.expenseService
 * @description
 * # expenseService
 * Service in the RoyalFood.
 */
RoyalFood.factory("expenseService", function($q, financeService) {
	var ref = new Firebase("https://royal-food.firebaseio.com/expense");
	return {
		getExpenseLogs: function(start, end) {
            var deferred = $q.defer();
            var result = [];
            ref.child("common").orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    value.id = log.key();
                    result.push(value);
                });
                deferred.resolve(result);
            });
            return deferred.promise;
		},
        addExpense: function(expense, callback) {
            ref.child("common").push(expense, function(error) {
                if(error == null) {
                    var amount = expense.amount;
                    var time = expense.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    financeService.updateFinance(year, month, -1*amount);
                    callback();
                }
            });
        },
        removeExpense: function(expense, callback) {
            ref.child("common").child(expense.id).remove(function(error) {
                if(error == null) {
                    var amount = expense.amount;
                    var time = expense.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    financeService.updateFinance(year, month, amount);
                    callback();
                }
            });
        },
        getSalaryLogs: function(start, end) {
            var deferred = $q.defer();
            var result = [];
            ref.child("salary").orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    value.id = log.key();
                    result.push(value);
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        addSalary: function(salary, callback) {
            ref.child("salary").push(salary, function(error) {
                if(error == null) {
                    var amount = salary.amount;
                    var time = salary.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    financeService.updateFinance(year, month, -1*amount);
                    callback();
                }
            });
        },
        removeSalary: function(salary, callback) {
            ref.child("salary").child(salary.id).remove(function(error) {
                if(error == null) {
                    var amount = salary.amount;
                    var time = salary.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    financeService.updateFinance(year, month, amount);
                    callback();
                }
            });
        }
	}
});