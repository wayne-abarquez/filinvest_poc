(function(){
'use strict';

angular.module('demoApp.operations')
    .factory('placesOfInterestServices', ['$q', 'POI_TYPES', 'MARKER_BASE_URL', 'gmapServices', placesOfInterestServices]);

    function placesOfInterestServices ($q, POI_TYPES, MARKER_BASE_URL, gmapServices) {
        var service = {};

        service.pois = [];

        service.placeTypes = POI_TYPES;


        service.getNearbyPOIByType = getNearbyPOIByType;
        service.showMarker = showMarker;
        service.resetData = resetData;


        function showMarker(item) {
            var foundItem = _.findWhere(service.pois, {id: item.id});
            if (foundItem) {
                gmapServices.hyperZoomToPosition(foundItem.geometry.location);
            }
        }


        function getPOIByType(type, bounds) {
            var dfd = $q.defer();

            var request = {
                bounds: bounds || gmapServices.map.getBounds(),
                type: type
            };

            var typeObj = _.findWhere(POI_TYPES, {type: type});

            gmapServices.getPlacesService()
                .nearbySearch(request, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        dfd.resolve(results.map(
                            function(item){
                                item.type = type;
                                item.mdIcon = typeObj.icon;
                                item.typeLabel = typeObj.label;
                                item.markerIconUrl = MARKER_BASE_URL+ typeObj.markerIcon;
                                item.color = typeObj.color;
                                return item;
                            })
                        );
                    } else {
                        dfd.reject(status);
                    }
                });

            return dfd.promise;
        }

        function createPOIMarker(item) {
            return gmapServices.createMarker(item.geometry.location, item.markerIconUrl);
        }

        function resetData() {
            if (!service.pois.length) return;

            service.pois.forEach(function(item){
               gmapServices.hideMarker(item.marker);
               gmapServices.hideLabel(item.label);
               item = null;
            });
            service.pois = [];
        }

        function processResult (result) {
            resetData();

            result.forEach(function(item){
                item.marker = createPOIMarker(item);
                item.label = gmapServices.createMapLabel(item.name, item.marker);
                service.pois.push(item);
            })
        }

        function getNearbyPOIByType(typesArray, bounds) {
            var dfd = $q.defer();

            var promises = [],
                result = [],
                it = {},
                except = ['marker', 'label'];

            typesArray.forEach(function(type){
                promises.push(getPOIByType(type, bounds));
            });

            $q.all(promises)
                .then(function(data){
                    data.forEach(function(arr){
                       result = result.concat(arr);
                    });

                    processResult(result);

                    dfd.resolve(result.map(function(item){
                        it = {};

                        for (var k in item) {
                            if (except.indexOf(k) === -1) it[k] = item[k];
                        }

                        return it;
                    }))
                }, function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        return service;
    }
}());