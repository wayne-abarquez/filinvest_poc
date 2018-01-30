(function () {
    'use strict';

    angular.module('demoApp')
        .factory('webRequest', ['$http', webRequest]);

    function webRequest($http) {
        var service = {};

        // fix 401 errors being automatically handled by browsers
        //var BASE_URL = location.protocol + "//" + "user:pass@" + location.host + "/";
        var BASE_URL = window.location.origin;

        function buildParams(params) {
            if (params != null && params.isObject)
                return _.map(params, function (key, val) {
                    return key + "=" + value;
                }).join("&");
            return "";
        };


        service.get = function (url, params) {
            return $http.get(BASE_URL + url + "?" + buildParams(params));
        };


        service.post = function (url, params) {
            return $http({
                url: BASE_URL + url,
                method: "POST",
                data: JSON.stringify(params),
                headers: {'Content-Type': 'application/json'}
            });
        };


        service.put = function (url, params) {
            return $http({
                url: BASE_URL + url,
                method: "PUT",
                data: JSON.stringify(params),
                headers: {'Content-Type': 'application/json'}
            });
        };


        service.delete = function (url) {
            return $http.delete(url);
        };


        //service.upload = function (url, fields, file) {
        //    return Upload.upload({
        //        url: BASE_URL + url,
        //        method: 'POST',
        //        fields: fields,
        //        file: file
        //    });
        //};


        return service;
    }

}());