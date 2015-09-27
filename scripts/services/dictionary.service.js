'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.dictionaryService
 * @description
 * # dictionaryService
 * Service in the RoyalFood.
 */
RoyalFood.factory("dictionaryService", function($q) {
	var ref = new Firebase("https://royal-food.firebaseio.com");
    var actionsRef = ref.child("actions");
    var workersRef = ref.child("workers");
    var expenseTypesRef = ref.child("expense_types");
    var investTypesRef = ref.child("invest_types");
	return {
        getActions: function() {
            var deferred = $q.defer();
            var result = {};
            actionsRef.once("value", function(actions) {
                actions.forEach(function(action) {
                    result[action.key()] = action.val();
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getWorkers: function() {
            var deferred = $q.defer();
            var result = {};
            workersRef.once("value", function(actions) {
                actions.forEach(function(action) {
                    result[action.key()] = action.val();
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getExpenseTypes: function() {
            var deferred = $q.defer();
            var result = {};
            expenseTypesRef.once("value", function(actions) {
                actions.forEach(function(action) {
                    result[action.key()] = action.val();
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        getInvestTypes: function() {
            var deferred = $q.defer();
            var result = {};
            investTypesRef.once("value", function(actions) {
                actions.forEach(function(action) {
                    result[action.key()] = action.val();
                });
                deferred.resolve(result);
            });
            return deferred.promise;
        }
	}
});