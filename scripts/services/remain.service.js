'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.remainService
 * @description
 * # remainService
 * Service in the RoyalFood.
 */
RoyalFood.factory("remainService", function($q) {
	var ref = new Firebase("https://royal-food.firebaseio.com/remain");
	return {
        getRemainData: function() {
            var deferred = $q.defer();
            var result = {};
            ref.once("value", function(remains) {
                remains.forEach(function(marketRemain) {
                    marketRemain.forEach(function(productRemain) {
                        if(!result[productRemain.key()]) {
                            result[productRemain.key()] = 0;
                        }
                        result[productRemain.key()] += productRemain.val();
                    });
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getMarketRemainData: function(marketId) {
            var deferred = $q.defer();
            var result = {};
            ref.child(marketId).once("value", function(remains) {
                remains.forEach(function(remain) {
                    result[remain.key()] = remain.val();
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getProductRemainData: function(productId) {
            var deferred = $q.defer();
            var result = {};
            ref.once("value", function(remains) {
                remains.forEach(function(remain) {
                    result[remain.key()] = remain.val()[productId];
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        updateMarketProductRemain: function(marketId, productId, quantity) {
            var countRef = ref.child(marketId).child(productId);
            countRef.once("value", function(current) {
                var value = current.val();
                countRef.set(value + quantity);
            });
        },
        addMarketRemain: function(marketId, products) {
            angular.forEach(products, function(product, productId) {
                ref.child(marketId).child(productId).set(0);
            });
        },
        addProductRemain: function(productId, markets) {
            angular.forEach(markets, function(market, marketId) {
                ref.child(marketId).child(productId).set(0);
            });
        }
	}
});