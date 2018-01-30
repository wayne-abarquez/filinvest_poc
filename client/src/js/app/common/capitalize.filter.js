(function () {
    'use strict';

    function capitalizeFilter() {
        return function (t) {
            if (!t) return t;

            function e(t) {
                return t.substring(0, 1).toUpperCase() + t.substring(1)
            }

            if (-1 !== t.indexOf(" ")) {
                var r, i;
                for (t = t.toLowerCase(), r = t.split(" "), i = 0; i < r.length; i++)r[i] = e(r[i]);
                return r.toString().replace(/,/g, " ")
            }
            return t = t.toLowerCase(), e(t)
        }
    }

    angular.module('demoApp')
        .filter('capitalize', [capitalizeFilter]);

}());