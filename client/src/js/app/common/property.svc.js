(function () {
    'use strict';

    angular.module('demoApp')
        .factory('propertyServices', ['$q', 'webServices', 'gmapServices', 'PROPERTY_ICONS', 'infoboxServices', propertyServices]);

    function propertyServices($q, webServices, gmapServices, PROPERTY_ICONS, infoboxServices) {
        var service = {};

        service.properties = [];

        var propertyMarkers = [],
            infowindow;

        service.loadProperties = loadProperties;
        service.hidePropertyMarkers = hidePropertyMarkers;
        service.getPropertyTypes = getPropertyTypes;
        service.getLocations = getLocations;
        service.searchProperties = searchProperties;
        service.highlightProperty = highlightProperty;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function onClickPropertyMarker() {
            console.log('onClickPropertyMarker this: ',this);

            // show infowindow
            infoboxServices.openInfobox(this.infobox, this);
        }

        function createPropertyMarker (data) {
            // var icon = '/images/markers/' + PROPERTY_ICONS[getRandomInt(0,3)];
            //var icon = '/images/markers/default-marker.png';
            var icon = '/images/markers/' + PROPERTY_ICONS[0];
            var marker = gmapServices.createMarker(data.latlng, icon);

            marker.propertyid = data.id;

            // create content for infowindow
            marker.infobox = infoboxServices.initInfobox(data);

            gmapServices.addListener(marker, 'click', onClickPropertyMarker.bind(marker));

            return marker;
        }

        function loadPropertyMarkers (list) {
            var foundMarker;
            list.forEach(function(item){
                if (propertyMarkers.length) {
                    foundMarker = _.findWhere(propertyMarkers, {propertyid: item.id});
                    if (foundMarker) return;
                }

                propertyMarkers.push(createPropertyMarker(item));
            })
        }

        function hidePropertyMarkers(idsToShow) {
            if (!propertyMarkers.length) return;

            infoboxServices.closeInfobox();

            if (idsToShow && idsToShow.length) {
                console.log('idsToShow: ', idsToShow);
                console.log('propertyMarkers: ', propertyMarkers);
                propertyMarkers = propertyMarkers.filter(function(marker){
                    if (idsToShow.indexOf(marker.propertyid) > -1) {
                        return marker;
                    }

                    gmapServices.hideMarker(marker);
                    marker = null;
                });
                console.log('after filtering propertyMarkers: ', propertyMarkers);
            } else {
                gmapServices.hideMarkers(propertyMarkers);
                propertyMarkers = [];
            }
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

        function searchProperties(filter) {
            var dfd = $q.defer();

            console.log('searchProperties filter: ', filter);

            webServices.getProperties(filter)
                .then(function (response) {
                    console.log('getProperties response: ', response);
                    hidePropertyMarkers(_.pluck(response.data, 'id'));
                    service.properties = response.data;
                    loadPropertyMarkers(response.data);
                    if (filter) {
                        gmapServices.setMapBoundsFromLatLngArray(service.properties.map(function(item){return item.latlng;}));
                    }
                    dfd.resolve(response.data);
                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function highlightProperty(propId) {
            var foundMarker = _.findWhere(propertyMarkers, {propertyid: propId});

            if (!foundMarker) return;

            gmapServices.hyperZoomToPosition(foundMarker.getPosition(), 18);
            // gmapServices.animateMarker(foundMarker);
            // show infowindow
            gmapServices.triggerEvent(foundMarker, 'click');

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