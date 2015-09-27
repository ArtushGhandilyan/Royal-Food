'use strict';

/**
 * @ngdoc filter
 * @name basic.filter:toTrusted
 * @function
 * @description
 * # toTrusted
 * Filter in the basic.
 */
StudentPortal.filter('toTrusted', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
});