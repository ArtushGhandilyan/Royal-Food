'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.investService
 * @description
 * # investService
 * Service in the RoyalFood.
 */
RoyalFood.factory("investService", function($q, financeService) {
	var ref = new Firebase("https://royal-food.firebaseio.com/invest");
	return {
		getInvestLogs: function(start, end) {
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
        addInvest: function(invest, callback) {
            ref.push(invest, function(error) {
                if(error == null) {
                    var amount = invest.amount;
                    var time = invest.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    financeService.updateFinance(year, month, amount);
                    callback();
                }
            });
        },
        removeInvest: function(invest, callback) {
            ref.child(invest.id).remove(function(error) {
                if(error == null) {
                    var amount = invest.amount;
                    var time = invest.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    financeService.updateFinance(year, month, -1*amount);
                    callback();
                }
            });
        }
	}
});