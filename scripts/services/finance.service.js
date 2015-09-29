'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.financeService
 * @description
 * # financeService
 * Service in the RoyalFood.
 */
RoyalFood.factory("financeService", function($q) {
	var ref = new Firebase("https://royal-food.firebaseio.com/finance");
	return {
        getFinance: function(year, month) {
            var deferred = $q.defer();
            var result = {};
            var yearInit = 0;
            ref.orderByKey().once("value", function(finance) {
                var commonFinance = finance.val();
                for(var j = 2015; j < year; j++) {
                    var prevYearFinance = commonFinance[j];
                    var toMonth = (j == year) ? month : 12;
                    for(var i = 0; i < toMonth; i++) {
                        yearInit += (prevYearFinance[i] || 0);
                    }
                }

                var currentYearFinance = commonFinance[year];
                for(var index = 0; index <= month; index++) {
                    result[index] = yearInit + (currentYearFinance[index] || 0);
                }

                deferred.resolve(result);
            });
            return deferred.promise;
        },
        updateFinance: function(year, month, amount) {
            var currentRef = ref.child(year).child(month);
            currentRef.once("value", function(current) {
                var value = 0;
                if(current.exists()) {
                    value = current.val();
                }
                currentRef.set(value + amount);
            });
        }
	}
});