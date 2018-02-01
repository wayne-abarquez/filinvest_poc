(function () {
    'use strict';

    angular.module('demoApp')
        .factory('webServices', ['webRequest', '$q', webServices]);

    function webServices(webRequest, $q) {
        var service = {};

        service.getProperties = getProperties;
        service.getPropertyTypes = getPropertyTypes;

        service.loadFloorplan = loadFloorplan;

        function getProperties(filter) {
            return webRequest.get('/api/properties', filter);
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