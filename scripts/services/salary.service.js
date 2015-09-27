'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.salaryService
 * @description
 * # salaryService
 * Service in the RoyalFood.
 */
RoyalFood.factory("salaryService", function($q, financeService) {
	var ref = new Firebase("https://royal-food.firebaseio.com/salary");
	return {
		getSalaryLogs: function(start, end) {
            var deferred = $q.defer();
            var result = [];
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    value.id = log.key();
                    result.push(value);
                });
                deferred.resolve(result);
            });
            return deferred.promise;
		},
        getMarketSalaryLogs: function(marketId, start, end) {
            var deferred = $q.defer();
            var result = [];
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    if(log.val().marketId == marketId) {
                        result.push(log.val());
                    }
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        addSalary: function(salary, callback) {
            ref.push(salary, function(error) {
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
            ref.child(salary.id).remove(function(error) {
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