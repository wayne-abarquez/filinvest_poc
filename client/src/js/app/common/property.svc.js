(function () {
    'use strict';

    angular.module('demoApp')
        .factory('propertyServices', ['$q', '$rootScope', 'MARKER_BASE_URL', 'webServices', 'gmapServices', 'PROPERTY_ICONS', 'infoboxServices', 'floorplanServices', 'modalServices', 'PROPERTY_MARKER_SELECTED', propertyServices]);

    function propertyServices($q, $rootScope, MARKER_BASE_URL, webServices, gmapServices, PROPERTY_ICONS, infoboxServices, floorplanServices, modalServices, PROPERTY_MARKER_SELECTED) {
        var service = {};

        service.properties = [];

        var markerBaseUrl = MARKER_BASE_URL,
            propertyMarkers = [],
            lastSelectedMarker;

        service.loadProperties = loadProperties;
        service.hidePropertyMarkers = hidePropertyMarkers;
        service.getPropertyTypes = getPropertyTypes;
        service.getLocations = getLocations;
        service.searchProperties = searchProperties;
        service.highlightProperty = highlightProperty;
        service.setMarkerToDefault = setMarkerToDefault;
        service.initFloorplan = initFloorplan;
        service.showPropertyDetails = showPropertyDetails;
        service.reset = reset;
        service.setBoundsFromProperties = setBoundsFromProperties;
        service.showGallery = showGallery;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function onClickPropertyMarker() {
            if (lastSelectedMarker && lastSelectedMarker.propertyid !== this.propertyid) lastSelectedMarker.setIcon(getMarkerDefaultIcon());

            lastSelectedMarker = this;

            $rootScope.$broadcast(PROPERTY_MARKER_SELECTED, {propertyid: this.propertyid});

            // show infowindow
            infoboxServices.openInfobox(this.infobox, this);
        }

        function getMarkerDefaultIcon() {
            // this is blue color
            return markerBaseUrl + PROPERTY_ICONS[0];
        }

        function getMarkerSelectedIcon() {
            // this is orange color
            return markerBaseUrl + PROPERTY_ICONS[2];
        }

        function createPropertyMarker (data) {
            // var icon = '/images/markers/' + PROPERTY_ICONS[getRandomInt(0,3)];
            //var icon = '/images/markers/default-marker.png';
            var icon = getMarkerDefaultIcon();
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

        function reset(includeMarkers) {
            if (includeMarkers) {
                hidePropertyMarkers();
                service.properties = [];
            }

            setMarkerToDefault();
            floorplanServices.clearFloorplanControl();
        }

        function setBoundsFromProperties () {
            gmapServices.setMapBoundsFromLatLngArray(service.properties.map(function (item) {
                return item.latlng;
            }));
        }

        function searchProperties(filter) {
            var dfd = $q.defer();

            // console.log('searchProperties filter: ', filter);

            webServices.getProperties(filter)
                .then(function (response) {
                    // console.log('getProperties response: ', response);

                    reset();

                    hidePropertyMarkers(_.pluck(response.data, 'id'));

                    service.properties = response.data;

                    loadPropertyMarkers(response.data);

                    if (filter) setBoundsFromProperties();

                    dfd.resolve(response.data);
                }, function (err) {
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function highlightProperty(propId, callFromOnClickMarker) {
            var foundMarker = _.findWhere(propertyMarkers, {propertyid: propId});

            if (!foundMarker) return;

            foundMarker.setIcon(getMarkerSelectedIcon());

            gmapServices.setZoomIfGreater(16);
            gmapServices.panTo(foundMarker.getPosition());
            // gmapServices.animateMarker(foundMarker);

            // show infowindow
            if (!callFromOnClickMarker) gmapServices.triggerEvent(foundMarker, 'click');

        }

        function getPropertyTypes() {
            return webServices.getPropertyTypes();
        }

        function getLocations() {
            return ['alabang'];
        }

        function setMarkerToDefault(propertyId) {
            if (!propertyId && lastSelectedMarker) {
                lastSelectedMarker.setIcon(getMarkerDefaultIcon());
                return;
            }

            var foundMarker = _.findWhere(propertyMarkers, {propertyid: propertyId});

            if (!foundMarker) return;

            foundMarker.setIcon(getMarkerDefaultIcon());
        }

        function initFloorplan(propertyId) {
            // close infobox
            infoboxServices.closeInfobox();

            // get property floorplan data in db
            floorplanServices.initFloorplan(propertyId);


            // show floorplan selection on rightside same as gmap controls
            // show 1st floor for initial floorplan
            // when floorplan selection item is clicked,
            // show its correspoding floorplan and room availability markers and show legend

            // show property details side panel
        }

        function showPropertyDetails(propertyId) {
            var foundProperty = _.findWhere(service.properties, {id: propertyId});
            if (foundProperty){
                return modalServices.showPropertyDetailsModal(foundProperty);
            }
        }

        function showGallery(propertyId) {
            var foundProperty = _.findWhere(service.properties, {id: propertyId});
            if (foundProperty) {
                return modalServices.showPropertyGallery(foundProperty);
            }
        }

        return service;
    }
}());