'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.logService
 * @description
 * # logService
 * Service in the RoyalFood.
 */
RoyalFood.factory("logService", function($q, financeService, remainService, stConstant) {
	var ref = new Firebase("https://royal-food.firebaseio.com/logs");
	return {
		getLogs: function(start, end) {
            var deferred = $q.defer();
            var result = [];
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    result.push(log.val());
                });
                deferred.resolve(result);
            });
            return deferred.promise;
		},
        addLog: function(log, coefficient, callback) {
            ref.push(log, function(error) {
                if(error == null) {
                    var marketId = log.marketId;
                    var productId = log.productId;
                    var time = log.date;
                    var month = new Date(time).getMonth();
                    var year = new Date(time).getFullYear();
                    var quantity = log.quantity * coefficient;
                    var amount = log.quantity * log.price * coefficient;
                    financeService.updateFinance(year, month, amount);
                    remainService.updateMarketProductRemain(marketId, productId, -1*quantity);
                    callback();
                }
            });
        },
        getMarketLogs: function(marketId, start, end) {
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
        getProductLogs: function(productId, start, end) {
            var deferred = $q.defer();
            var result = [];
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    if(log.val().productId == productId) {
                        result.push(log.val());
                    }
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getAmountBuySell: function(start, end) {
            var deferred = $q.defer();
            var sell = {};
            var buy = {};
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    var month = new Date(value.date).getMonth();
                    var amount = (value.price * value.quantity);

                    if(value.actionId == stConstant.SELL_ACTION_ID) {
                        sell[month] = sell[month] || 0;
                        sell.common = sell.common || 0;

                        sell[month] += amount;
                        sell.common += amount;
                    } else if(value.actionId == stConstant.BUY_ACTION_ID) {
                        buy[month] = buy[month] || 0;
                        buy.common = buy.common || 0;

                        buy[month] += amount;
                        buy.common += amount;
                    }
                });
                deferred.resolve({sell: sell, buy: buy});
            });
            return deferred.promise;
        },
        getAmountSell: function(start, end) {
            var deferred = $q.defer();
            var result = 0;
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    if(value.actionId == stConstant.SELL_ACTION_ID) {
                        result += (value.price * value.quantity);
                    }
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getAmountBuy: function(start, end) {
            var deferred = $q.defer();
            var result = 0;
            ref.orderByChild("date").startAt(start.getTime()).endAt(end.getTime()).once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    if(value.actionId == stConstant.BUY_ACTION_ID) {
                        result += (value.price * value.quantity);
                    }
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        }
	}
});