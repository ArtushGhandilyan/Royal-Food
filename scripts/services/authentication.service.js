'use strict';

/**
 * @ngdoc service
 * @name RoyalFood.authService
 * @description
 * # authService
 * Service in the RoyalFood.
 */
RoyalFood.factory('authService', function($rootScope, $log, $location, $firebaseAuth) {
    var ref = new Firebase("https://royal-food.firebaseio.com");
    var auth = $firebaseAuth(ref);

    //auth.$onAuth(function(authData) {
    //    if(authData) {
    //        if($location.path() == '/login') {
    //            $location.path('/dashboard');
    //        }
    //        $rootScope.user = {
    //            email: authData.password.email,
    //            profileImageURL: authData.password.profileImageURL
    //        }
    //    } else {
    //        $location.path('/login');
    //    }
    //});

    return {     
        login: function(credentials) {
            auth.$authWithPassword({
                email: credentials.email, 
                password: credentials.password
            }).then(function(authData) {

                $log.info("Logged in as:", authData.uid);
                delete $rootScope.loginErrorMessage;

                $location.path('/dashboard');
            }).catch(function(error) {

                $log.error("Authentication failed:", error);
                $rootScope.loginErrorMessage = error;

                $location.path('/login');
            });
        },
        isAuthenticated: function() {
            return !!ref.getAuth();
        },
        logout: function() {
            ref.unauth();
        }
    }
});
