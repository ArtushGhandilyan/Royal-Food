'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.marketService
 * @description
 * # marketService
 * Service in the RoyalFood.
 */
RoyalFood.factory("marketService", function($q, financeService, remainService) {
	var ref = new Firebase("https://royal-food.firebaseio.com/markets");
	return {
		getMarkets: function() {
            var deferred = $q.defer();
            var result = {};
            ref.once("value", function(markets) {
                markets.forEach(function(market) {
                    result[market.key()] = market.val();
                });
                deferred.resolve(result);
            });
			return deferred.promise;
		},
        addMarket: function(market, dictionaryData) {
            var marketRef = ref.push(market);
            var marketId = marketRef.key();
            remainService.addMarketRemain(marketId, dictionaryData.products);
            return marketId;
        }
	}
});