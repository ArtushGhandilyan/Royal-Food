'use strict';

/**
 * @ngdoc overview
 * @name RoyalFood
 * @description
 * # RoyalFood
 *
 * Main module of the application.
 */
var RoyalFood = angular.module('RoyalFood', ['ngAnimate', 'ngRoute', 'ngMaterial', 'ngTouch', 'firebase']).
	config(function ($routeProvider, $mdThemingProvider) {
		$routeProvider
			.when('/login', {
				title: 'Royal Food',
				secure: false,
				templateUrl: 'views/pages/login.page.html',
				controller: 'loginController'
			})
			.when('/dashboard', {
				title: 'Dashboard',
				secure: true,
				templateUrl: 'views/pages/dashboard.page.html',
				controller: 'dashboardController',
                resolve: {
                    actions: function(dictionaryService) {
                        return dictionaryService.getActions();
                    },
                    markets: function(marketService) {
                        return marketService.getMarkets();
                    },
                    products: function(productService) {
                        return productService.getProducts();
                    }
                }
			})
			.when('/markets', {
				title: 'Markets',
				secure: true,
				templateUrl: 'views/pages/markets.page.html',
				controller: 'marketsController',
				resolve: {
                    actions: function(dictionaryService) {
                        return dictionaryService.getActions();
                    },
                    markets: function(marketService) {
                        return marketService.getMarkets();
                    },
                    products: function(productService) {
                        return productService.getProducts();
                    },
                    marketId: function($route) {
                        return $route.current.params.marketId;
                    }
				}
			})
            .when('/products', {
                title: 'Products',
                secure: true,
                templateUrl: 'views/pages/products.page.html',
                controller: 'productsController',
                resolve: {
                    actions: function(dictionaryService) {
                        return dictionaryService.getActions();
                    },
                    markets: function(marketService) {
                        return marketService.getMarkets();
                    },
                    products: function(productService) {
                        return productService.getProducts();
                    },
                    productId: function($route) {
                        return $route.current.params.productId;
                    }
                }
            })
            .when('/finance', {
                title: 'Finance',
                secure: true,
                templateUrl: 'views/pages/finance.page.html',
                controller: 'financeController',
                resolve: {
                    actions: function(dictionaryService) {
                        return dictionaryService.getActions();
                    },
                    workers: function(dictionaryService) {
                        return dictionaryService.getWorkers();
                    },
                    expenseTypes: function(dictionaryService) {
                        return dictionaryService.getExpenseTypes();
                    },
                    investTypes: function(dictionaryService) {
                        return dictionaryService.getInvestTypes();
                    },
                    markets: function(marketService) {
                        return marketService.getMarkets();
                    },
                    products: function(productService) {
                        return productService.getProducts();
                    }
                }
            })
            .when('/cash-flow', {
                title: 'Cash Flow',
                secure: true,
                templateUrl: 'views/pages/cashflow.page.html',
                controller: 'cashFlowController'
            })
            .when('/settings', {
                title: 'Settings',
                secure: true,
                templateUrl: 'views/pages/settings.page.html',
                controller: 'settingsController',
                resolve: {
                    actions: function(dictionaryService) {
                        return dictionaryService.getActions();
                    },
                    markets: function(marketService) {
                        return marketService.getMarkets();
                    },
                    products: function(productService) {
                        return productService.getProducts();
                    }
                }
            })
			.otherwise({
				redirectTo:'/dashboard'
			});

        $mdThemingProvider.theme('default')
            .primaryPalette('red')
            .accentPalette('orange');

	}).
	run(function($rootScope, $http, $location, authService) {
        //TODO: move to constants
        $rootScope.stMonthNames = [
            "Հունվար", "Փետրվար", "Մարտ", "Ապրիլ",
            "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս",
            "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"
        ];


		$rootScope.$on('$routeChangeStart', function (event, next, current) {
			// redirect to login page if not logged in.
			if (next.secure && !authService.isAuthenticated()) {
				$location.path('/login');
			}
			document.title = next.title;
		});
	});