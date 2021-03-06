(function(){
'use strict';

angular.module('demoApp.estateMgmt')
    .factory('layersServices', ['$q', 'webServices', 'gmapServices', 'propertyServices', layersServices]);

    function layersServices ($q, webServices, gmapServices, propertyServices) {
        var service = {};

        var layerMarkers = {};
        var infowindow;

        var defaultColor = '#95a5a6';
        var bounds;

        service.loadLayers = loadLayers;
        service.hideLayers = hideLayers;

        function onMarkerClick () {
            if (!infowindow) infowindow = gmapServices.createInfoWindow('');

            infowindow.setContent(this.content);
            infowindow.open(gmapServices.map, this);
        }

        function loadLayer(layer) {
            console.log('loadLayer: ',layer);

            if (!layer.dataSrc) return;

            var dfd = $q.defer();
            var label = layer.label.toLowerCase();

            if (layer.isMapStyle) {
                webServices.getLayer(layer.dataSrc)
                    .then(function (result) {
                        console.log('load map style: ',result);
                        gmapServices.updateMapStyle(result);
                    });
            } else if (layer.isMarkers) {
                webServices.getLayer(layer.dataSrc)
                    .then(function (result){
                       var marker,
                           latLng;
                       layerMarkers[label] = [];

                       result.forEach(function(item){
                           latLng = {lat: item.lat, lng: item.lng};
                           marker = gmapServices.createCircleMarker(latLng, (layer.color ? layer.color : defaultColor));
                           marker.content = '<span class="badge badge-default" style="color:#fff;">'+layer.label+'</span>';
                           gmapServices.addListener(marker, 'click', onMarkerClick.bind(marker));
                           bounds.extend(latLng);
                           layerMarkers[label].push(marker);
                       });

                       gmapServices.map.fitBounds(bounds);

                       dfd.resolve(result);
                    }, function(err){
                        dfd.reject(err);
                    });
            } else {
                dfd.reject();
            }

            return dfd.promise;
        }

        function loadLayers(item) {
            var promises;

            if (!promises) {
                promises = [];
                bounds = new google.maps.LatLngBounds();
            }

            if (!item.children) {
                promises.push(
                   loadLayer(item)
                );
            } else {
                item.children.forEach(function(layerItem){
                    loadLayers(layerItem);
                });
            }
        }

        function hideLayerMarkers(layer) {
            var label = layer.label.toLowerCase();

            if (layerMarkers[label] && layerMarkers[label].length) {
                gmapServices.hideMarkers(layerMarkers[label]);
                layerMarkers[label] = [];
            }
        }

        function hideLayers(item) {
            if (!item && layerMarkers) {
                for (var k in layerMarkers) {
                    gmapServices.hideMarkers(layerMarkers[k]);
                    layerMarkers[k] = [];
                }
                return;
            }

            if (item.children) {
                item.children.forEach(function (layerItem) {
                    hideLayers(layerItem);
                });
            } else if (item.isMapStyle) {
                gmapServices.updateMapStyle([], true);
            } else if (item.isMarkers) {
                    hideLayerMarkers(item);
            }
        }

        return service;
    }
}());