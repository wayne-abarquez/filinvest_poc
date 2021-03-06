(function () {
    'use strict';

    angular.module('demoApp')
        .factory('webServices', ['webRequest', '$q', webServices]);

    function webServices(webRequest, $q) {
        var service = {};

        service.getProperties = getProperties;
        service.getPropertiesByBounds = getPropertiesByBounds;
        service.getPropertyTypes = getPropertyTypes;

        service.loadFloorplan = loadFloorplan;
        service.getFloorUnits = getFloorUnits;

        service.getLayersData = getLayersData;
        service.getLayer = getLayer;

        service.getFaultLineData = getFaultLineData;


        function getProperties(filter) {
            return webRequest.get('/api/properties', filter);
        }

        function getPropertiesByBounds(boundsParam) {
            return webRequest.get('/api/properties', {bounds: boundsParam});
        }

        function getPropertyTypes() {
            return webRequest.get('/api/property_types');
        }

        function loadFloorplan(propertyId) {
            var dfd = $q.defer();

            webRequest.get('/static/data/floors.json')
                .then(function(response){
                    var foundFloor = _.findWhere(response.data, {propertyid: propertyId});
                    dfd.resolve(foundFloor || response.data[0]);
                },function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function getFloorUnits(propertyId, floorName) {
            var dfd = $q.defer();

            loadFloorplan(propertyId)
                .then(function(propertyData){

                    var foundFloor = _.findWhere(propertyData.floors, {name: floorName});
                    if (foundFloor) {
                        dfd.resolve(foundFloor.rooms);
                    } else {
                        dfd.reject();
                    }

                    dfd.resolve(foundFloor || response.data[0]);
                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function getFaultLineData() {
            var dfd = $q.defer();

            webRequest.get('/static/data/faultline-data.json')
                .then(function (response) {
                    dfd.resolve(response.data);
                }, function (err) {
                    dfd.reject(err);
                });
            return dfd.promise;
        }

        function getLayersData() {
            var dfd = $q.defer();

            webRequest.get('/static/data/layers.json')
                .then(function(response){
                    dfd.resolve(response.data);
                }, function(err){
                    dfd.reject(err);
                });
            return dfd.promise;
        }

        function getLayer(url) {
            var dfd = $q.defer();

            webRequest.get(url)
                .then(function (response) {
                    dfd.resolve(response.data);
                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        // function createBuilding(data) {
        //     return webRequest.post('/api/buildings', data);
        // }
        //
        // function deleteBuilding(buildingId) {
        //     var url = '/api/buildings/' + buildingId;
        //     return webRequest.delete(url);
        // }
        //
        // function updateWaypoint(waypointId, data) {
        //     var url = '/api/waypoints/' + waypointId;
        //     return webRequest.put(url, data);
        // }

        return service;
    }

}());