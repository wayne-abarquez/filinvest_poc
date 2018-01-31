(function () {
    'use strict';

    angular.module('demoApp')
        .factory('propertyServices', ['$q', 'webServices', 'gmapServices', propertyServices]);

    function propertyServices($q, webServices, gmapServices) {
        var service = {};

        service.properties = [];

        var propertyMarkers = [];
        var PROPS_ICONS = ['fi-marker-blue.png', 'fi-marker-green.png', 'fi-marker-orange.png', 'fi-marker-red.png'];

        service.loadProperties = loadProperties;
        service.getPropertyTypes = getPropertyTypes;
        service.getLocations = getLocations;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function createPropertyMarker (data) {
            var icon = '/images/markers/' + PROPS_ICONS[getRandomInt(0,3)];
            var marker = gmapServices.createMarker(data.latlng, icon);

            marker.propertyid = data.id;

            return marker;
        }

        function loadPropertyMarkers (list) {
            list.forEach(function(item){
                propertyMarkers.push(createPropertyMarker(item));
            })
        }

        function loadProperties() {
            var dfd = $q.defer();

            webServices.getProperties()
                .then(function (response) {
                    service.properties = response.data;
                    loadPropertyMarkers(response.data);
                    dfd.resolve(response.data);
                }, function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function getPropertyTypes() {
            return webServices.getPropertyTypes();
        }

        function getLocations() {
            return ['alabang'];
        }

        return service;
    }
}());