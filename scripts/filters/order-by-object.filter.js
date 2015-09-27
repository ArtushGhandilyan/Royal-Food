'use strict';

/**
 * @ngdoc filter
 * @name basic.filter:orderObjectBy
 * @function
 * @description
 * # orderObjectBy
 * Filter in the basic.
 */
StudentPortal.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];

        angular.forEach(items, function(item) {
            filtered.push(item);
        });

        function getProp(object, property) {
            var index;
            while((index = property.indexOf('.')) != -1) {
                object = object[property.substring(0, index)];
                property = property.substring(index + 1);
            }
            return object[property];
        }

        filtered.sort(function (a, b) {
            return (getProp(a, field) > getProp(b, field) ? 1 : -1);
        });

        if(reverse) {
            filtered.reverse();
        }

        return filtered;
    };
});