(function(){
'use strict';

angular.module('demoApp.planDesign')
    .factory('planDesignServices', ['$rootScope', '$q', '$filter', 'gmapServices', 'webServices', 'MARKER_BASE_URL', 'PROPERTY_ICONS', 'PROPERTY_MARKER_SELECTED', 'infoboxServices', planDesignServices]);

    function planDesignServices ($rootScope, $q, $filter, gmapServices, webServices, MARKER_BASE_URL, PROPERTY_ICONS, PROPERTY_MARKER_SELECTED, infoboxServices) {
        var service = {};

        var completionSampleData = {
            tower: 'Tower 3',
            completions: [
                {
                    completion: 41.12,
                    completionValue: 41,
                    imageSrc: '/images/properties/studio-city/construction-update/Studio-City_construction_update_website_may2016_01.jpg',
                    date: 'May 2016',
                    remarks: 'Studio City Tower 3 is 41.12% completed',
                    color: 'orange'
                },
                {
                    completion: 80.15,
                    completionValue: 80,
                    imageSrc: '/images/properties/studio-city/construction-update/Studio-City_construction_update_website_november2016_01.jpg',
                    date: 'November 2016',
                    remarks: 'Studio City Tower 3 is 80.15% completed',
                    color: 'green'
                },
                {
                    completion: 94.10,
                    completionValue: 94,
                    imageSrc: '/images/properties/studio-city/construction-update/Studio-City_construction_update_website_february2017_01.jpg',
                    date: 'February 2017',
                    remarks: 'Studio City Tower 3 is 94.10% completed',
                    color: 'green'
                },
                {
                    completion: 99,
                    completionValue: 99,
                    imageSrc: '/images/properties/studio-city/construction-update/Studio-City_construction_update_website_June2017_01.jpg',
                    date: 'June 2017',
                    remarks: 'Studio City Tower 3 is Nearing completion',
                    color: 'green'
                },
            ]
        };

        var lastSelectedMarker;
        var scope_;

        service.properties = [];

        service.showConstructionStatusMarkersByBounds = showConstructionStatusMarkersByBounds;
        service.showMarker = showMarker;
        service.getLegend = getLegend;
        service.resetMapObjects = resetMapObjects;
        service.updateConstructInfoboxContent = updateConstructInfoboxContent;


        function getLegend() {
            return {
              '0 - 25%': MARKER_BASE_URL + PROPERTY_ICONS[3],
              '26 - 75%': MARKER_BASE_URL + PROPERTY_ICONS[2],
              '76 - 100%': MARKER_BASE_URL + PROPERTY_ICONS[1],
              'Ready for Occupancy': MARKER_BASE_URL + PROPERTY_ICONS[0]
            };
        }

        function showMarker(propId) {
            var found = _.findWhere(service.properties, {id: propId});
            if (found) {
                gmapServices.triggerEvent(found.marker, 'click');
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
            });

            service.properties = [];
        }

        function setBoundsFromProperties() {
            gmapServices.setMapBoundsFromLatLngArray(service.properties.map(function (item) {
                return item.latlng;
            }));
        }

        function onClickPropertyMarker() {
            console.log('onClickPropertyMarker: ',this);

            lastSelectedMarker = this;

            //var property = _.findWhere(service.properties, {id: this.propertyid});

            // show infowindow
            //infoboxServices.openContructInfobox(this, property, scope_, compiledContent);
            infoboxServices.openConstructionStatusInfobox(this);

            $rootScope.$broadcast(PROPERTY_MARKER_SELECTED, {propertyid: this.propertyid});
        }

        var compiledContent;

        function createMarker(item) {
            var marker = gmapServices.createMarker(item.latlng, getIconByCompletionAndStatus(item.completion, item.status.toLowerCase()));

            marker.propertyid = item.id;

            // create content for infowindow
            marker.infoboxContent = infoboxServices.createConstructionStatusContent(item);

            gmapServices.addListener(marker, 'click', onClickPropertyMarker.bind(marker));

            return marker;
        }

        function showConstructionStatusMarkersByBounds(bounds, scope) {
            var dfd = $q.defer();
            var prop = {};
            scope_ = scope;

            resetMapObjects();

            getConstructionStatusDataByBounds(bounds)
                .then(function(list){
                    //compiledContent = infoboxServices.createConstructionStatusInfobox(scope_);

                    list.forEach(function(item){
                        prop = item;
                        prop.completionData = completionSampleData;
                        prop.marker = createMarker(item);
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

        function updateConstructInfoboxContent(propertyId, completionDataIndex) {
            var foundIndex = _.findIndex(service.properties, function(item){
                return item.id == propertyId;
            });
            if (foundIndex > -1) {
                var data = service.properties[foundIndex].completionData.completions[completionDataIndex];
                $('.construct-infowindow .completion-percent').css('color', data.color).text(data.completion+'% Completed');
                $('.construct-infowindow .completion-date').text(data.date);
                $('.construct-infowindow .completion-img').attr('src', data.imageSrc);
                $('.construct-infowindow .completion-remarks').text(data.remarks);
            }
        }

        return service;
    }
}());