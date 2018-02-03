(function(){
'use strict';

angular.module('demoApp.planDesign')
    .factory('planDesignServices', ['$q', '$filter', 'gmapServices', 'webServices', 'MARKER_BASE_URL', 'PROPERTY_ICONS', planDesignServices]);

    function planDesignServices ($q, $filter, gmapServices, webServices, MARKER_BASE_URL, PROPERTY_ICONS) {
        var service = {};

        service.properties = [];

        service.showConstructionStatusMarkersByBounds = showConstructionStatusMarkersByBounds;
        service.showMarker = showMarker;

        function showMarker(propId) {
            var found = _.findWhere(service.properties, {id: propId});
            if (found) {
                gmapServices.hyperZoomToPosition(found.latlng);
            }
        }

        function getIconByCompletionAndStatus(completion, status) {
            if (status == 'ready for occupancy') {
                return MARKER_BASE_URL + PROPERTY_ICONS[0];
            } else if (completion > 75) {
                return MARKER_BASE_URL + PROPERTY_ICONS[1];
            } else if (completion > 25) {
                return MARKER_BASE_URL + PROPERTY_ICONS[2];
            } else {
                return MARKER_BASE_URL + PROPERTY_ICONS[3];
            }
        }

        function getLabelClassByCompletionAndStatus(completion, status) {
            if (status == 'ready for occupancy') {
                return 'primary';
            } else if (completion > 75) {
                return 'success';
            } else if (completion > 25) {
                return 'warning';
            } else {
                return 'danger';
            }
        }

        function resetMapObjects() {
            if (!service.properties.length) return;

            service.properties.forEach(function(item){
                if (item.marker) item.marker.setMap(null);
                if (item.label) item.label.setMap(null);
                item = null;
            })
            service.properties = [];
        }

        function setBoundsFromProperties() {
            gmapServices.setMapBoundsFromLatLngArray(service.properties.map(function (item) {
                return item.latlng;
            }));
        }

        function showConstructionStatusMarkersByBounds(bounds) {
            var dfd = $q.defer();
            var prop = {};

            resetMapObjects();

            getConstructionStatusDataByBounds(bounds)
                .then(function(list){
                    list.forEach(function(item){
                        prop = item;
                        prop.marker = gmapServices.createMarker(item.latlng, getIconByCompletionAndStatus(item.completion, item.status.toLowerCase()));
                        prop.label = gmapServices.createMapLabel($filter('capitalize')(item.name), prop.marker);
                        prop.labelClass = getLabelClassByCompletionAndStatus(item.completion, item.status.toLowerCase());
                        service.properties.push(prop);
                    });
                    setBoundsFromProperties();
                    dfd.resolve(list)
                }, function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function getConstructionStatusDataByBounds (bounds) {
            var dfd = $q.defer();

            webServices.getPropertiesByBounds(bounds)
                .then(function(response){
                    dfd.resolve(response.data);
                }, function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        return service;
    }
}());