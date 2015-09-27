'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.cashService
 * @description
 * # cashService
 * Service in the RoyalFood.
 */
RoyalFood.factory("cashService", function($q) {
	var ref = new Firebase("https://royal-food.firebaseio.com/cash");
	return {
		getCashLogs: function() {
            var deferred = $q.defer();
            var result = [];
            ref.once("value", function(logs) {
                logs.forEach(function(log) {
                    var value = log.val();
                    value.id = log.key();
                    result.push(value);
                });
                deferred.resolve(result);
            });
            return deferred.promise;
		},
        addCash: function(cash, callback) {
            ref.push(cash, function(error) {
                if(error == null) {
                    callback();
                }
            });
        },
        removeCash: function(cash, callback) {
            ref.child(cash.id).remove(function(error) {
                if(error == null) {
                    callback();
                }
            });
        }
	}
});