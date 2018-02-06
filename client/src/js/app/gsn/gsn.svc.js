(function(){
'use strict';

angular.module('demoApp.gsn')
    .factory('gsnServices', ['webServices', '$q', 'gmapServices', 'MARKER_BASE_URL', 'GSN_TYPES', gsnServices]);

    function gsnServices (webServices, $q, gmapServices, MARKER_BASE_URL, GSN_TYPES) {
        var service = {};

        var gsnMarkers = {};
        //var bounds;

        var data = {
            'campaign': '/static/data/campaigns.json',
            'sales': '/static/data/sales.json',
            'leads and prospect': '/static/data/leads.json'
        };

        service.getGSNByTypes = getGSNByTypes;
        service.resetData = resetData;

        function resetData() {
            for (var k in gsnMarkers) {
                if (gsnMarkers[k] && gsnMarkers[k].length) {
                    gmapServices.hideMarkers(gsnMarkers[k]);
                    gsnMarkers[k] = null;
                }
            }
            gsnMarkers = {};
            //bounds = null;
        }

        function getGSNByType(type) {
            var dfd = $q.defer();
            var found = _.findWhere(GSN_TYPES, {type: type})
            var markerIcon = MARKER_BASE_URL + found.markerIcon;

            if (data[type]) {
                webServices.getLayer(data[type])
                    .then(function (result) {
                        console.log('get gsn data: ',result);
                        var marker,
                            latLng;

                        gsnMarkers[type] = [];

                        result.forEach(function (item) {
                            latLng = {lat: item.lat, lng: item.lng};
                            marker = gmapServices.createMarker(latLng, markerIcon);
                            //bounds.extend(latLng);
                            gsnMarkers[type].push(marker);
                        });

                        //gmapServices.map.fitBounds(bounds);

                        dfd.resolve(result);
                    }, function (err) {
                        dfd.reject(err);
                    });
            } else {
                dfd.reject();
            }

            return dfd.promise;
        }

        function getGSNByTypes(types) {
            resetData();

            var dfd = $q.defer(),
                      promises = [];

            //bounds = new google.maps.LatLngBounds();

            types.forEach(function(type){
                promises.push(
                    getGSNByType(type.toLowerCase())
                );
            });

            $q.all(promises)
                .then(function(result){
                   dfd.resolve(result);
                }, function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }


        return service;
    }
}());