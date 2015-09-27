'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.productService
 * @description
 * # productService
 * Service in the RoyalFood.
 */
RoyalFood.factory("productService", function($q, remainService) {
	var ref = new Firebase("https://royal-food.firebaseio.com/products");
	return {
        getProducts: function() {
            var deferred = $q.defer();
            var result = {};
            ref.once("value", function(products) {
                products.forEach(function(product) {
                    result[product.key()] = product.val();
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        addProduct: function(product, dictionaryData) {
            var productRef = ref.push(product);
            var productId = productRef.key();
            remainService.addProductRemain(productId, dictionaryData.markets);
            return productId;
        }
	}
});