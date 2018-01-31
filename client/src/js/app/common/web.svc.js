(function () {
    'use strict';

    angular.module('demoApp')
        .factory('webServices', ['webRequest', webServices]);

    function webServices(webRequest) {
        var service = {};

        service.getProperties = getProperties;
        service.getPropertyTypes = getPropertyTypes;

        function getProperties(filter) {
            return webRequest.get('/api/properties', filter);
        }

        function getPropertyTypes() {
            return webRequest.get('/api/property_types');
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