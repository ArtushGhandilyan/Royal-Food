'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.utilsService
 * @description
 * # utilsService
 * Service in the RoyalFood.
 */
RoyalFood.factory("utilsService", function(stConstant) {
	return {
        getInfo: function(logs, actions, products) {
            var info = {};

            angular.forEach(products, function(value, productId) {
                info[productId] = {};
                info.common = {};

                angular.forEach(actions, function(value, actionId) {
                    info[productId][actionId] = {
                        quantity: 0,
                        amount: 0
                    };

                    info.common[actionId] = {
                        quantity: 0,
                        amount: 0
                    }
                });
            });

            angular.forEach(logs, function(log) {
                info[log.productId][log.actionId].quantity += log.quantity;
                info[log.productId][log.actionId].amount += (log.quantity * log.price);

                info.common[log.actionId].quantity += log.quantity;
                info.common[log.actionId].amount += (log.quantity * log.price);
            });

            return info;
        },
        getProductInfo: function(logs, actions, markets) {
            var info = {};

            angular.forEach(markets, function(value, marketId) {
                info[marketId] = {};
                info.common = {};

                angular.forEach(actions, function(value, actionId) {
                    info[marketId][actionId] = {
                        quantity: 0,
                        amount: 0
                    };

                    info.common[actionId] = {
                        quantity: 0,
                        amount: 0
                    }
                });
            });

            angular.forEach(logs, function(log) {
                info[log.marketId][log.actionId].quantity += log.quantity;
                info[log.marketId][log.actionId].amount += (log.quantity * log.price);

                info.common[log.actionId].quantity += log.quantity;
                info.common[log.actionId].amount += (log.quantity * log.price);
            });

            angular.forEach(markets, function(market, marketId) {
                info[marketId].balance = info[marketId][stConstant.SELL_ACTION_ID].amount -
                    info[marketId][stConstant.BUY_ACTION_ID].amount;
            });

            return info;
        },
        getCurrentMonthInterval: function() {
            // init interval for this mouth
            var month = new Date().getMonth();
            var year = new Date().getFullYear();
            return {
                start: new Date(year, month, 1),
                end: new Date()
            };
        },
        getMonthInterval: function(year, month) {
            return {
                start: new Date(year, month, 1),
                end: new Date(year, month + 1, 0)
            };
        },
        getYearInterval: function(year) {
            return {
                start: new Date(year, 0, 1),
                end: new Date()
            };
        },
        groupBy: function(array, groupProp, sumProp) {
            var result = {};
            array.forEach(function(item) {
                if(!result[item[groupProp]]) {
                    result[item[groupProp]] = 0;
                }
                result[item[groupProp]] += item[sumProp];
            });
            return result;
        },
        groupByMonth: function(array) {
            var result = {};
            angular.forEach(array, function(item) {
                angular.forEach(item, function(amount, month) {
                    if(!result[month]) {
                        result[month] = 0;
                    }
                    result[month] += amount;
                });
            });
            return result;
        },
        groupSalaryByMonth: function(array) {
            var result = {
                common: 0
            };
            angular.forEach(array, function(item) {
                var month = new Date(item.date).getMonth();
                if(!result[month]) {
                    result[month] = 0;
                }
                result[month] += item.amount;
                result.common += item.amount;
            });
            return result;
        },
        groupByWithMonth: function(array, groupProp, sumProp) {
            var result = {};
            array.forEach(function(item) {
                var month = new Date(item.date).getMonth();

                if(!result[item[groupProp]]) {
                    result[item[groupProp]] = {
                        common: 0
                    };
                }
                if(!result[item[groupProp]][month]) {
                    result[item[groupProp]][month] = 0;
                }


                result[item[groupProp]][month] += item[sumProp];
                result[item[groupProp]].common += item[sumProp];
            });
            return result;
        },
        sumBy: function(array, sumProp) {
            var result = 0;
            angular.forEach(array, function(item) {
                result += item[sumProp];
            });
            return result;
        }
	}
});