(function(){
'use strict';

angular.module('demoApp.planDesign')
    .controller('planDesignPageController', ['$rootScope', '$q', 'FILTER_ADDRESS_RESULT_RETURNED', 'TILES_LOADED', 'hazardMapServices', 'planDesignServices', 'alertServices', 'gmapServices', planDesignPageController]);

    function planDesignPageController($rootScope, $q, FILTER_ADDRESS_RESULT_RETURNED, TILES_LOADED, hazardMapServices, planDesignServices, alertServices, gmapServices) {
        var vm = this;

        vm.hazardBtn = {
            isOpen: false,
            isFloodMapActivated: false,
            isLandslideMapActivated: false,
            isFaultLineActivated: false,
            isStormSurgeActivated: false
        };

        vm.constructionBtn = {
            isEnabled: false
        };

        vm.result = [];

        vm.toggleConstructionStatus = toggleConstructionStatus;
        vm.onItemClick = onItemClick;

        vm.toggleFloodMap = toggleFloodMap;
        vm.toggleLandslideLayer = toggleLandslideLayer;
        vm.toggleFaultLineLayer = toggleFaultLineLayer;
        vm.toggleStormSurgeLayer = toggleStormSurgeLayer;

        function showHazardSpinner(layerName) {
            alertServices.showCustomToast({
                hideDelay: 0,
                position: 'bottom right',
                template: '<md-toast>' +
                '<div class="md-toast-content">' +
                '<md-progress-circular class="md-accent" md-diameter="20px" style="margin-right: 15px;"></md-progress-circular>' +
                ' Loading ' + layerName + ' layer' +
                '</div>' +
                '</md-toast>'
            });
        }

        function getConstructionStatusData(bounds) {
            var dfd = $q.defer();

            planDesignServices.showConstructionStatusMarkersByBounds(bounds.toUrlValue())
                .then(function(data){
                    if (!data.length || !data) alertServices.showToast('No Properties on this area.', 'bottom right');
                    vm.result = data;
                    dfd.resolve(data);
                }, function(err){
                    dfd.reject(err);
                });

            return dfd.promise;
        }

        function onItemClick(item) {
            planDesignServices.showMarker(item.id);
        }

        function toggleConstructionStatus() {
            vm.constructionBtn.isEnabled = !vm.constructionBtn.isEnabled;

            if (vm.constructionBtn.isEnabled) {
                // show the legend on completion status on bottom right
                // get the current bounding box
                // call planDesignServices.showConstructionStatusMarkersByBounds()
                // get the result on callback
                // show the list
                getConstructionStatusData(gmapServices.map.getBounds());
            } else {
                // hide markers
                // reset list
            }

        }

        function toggleFloodMap() {
            vm.hazardBtn.isFloodMapActivated = !vm.hazardBtn.isFloodMapActivated;

            if (vm.hazardBtn.isFloodMapActivated) {
                showHazardSpinner('Flood');
                hazardMapServices.loadFloodMap();
                return;
            }

            hazardMapServices.hideFloodMap();
            alertServices.showToast('Flood layer deactivated', 'bottom right');
        }

        function toggleLandslideLayer() {
            vm.hazardBtn.isLandslideMapActivated = !vm.hazardBtn.isLandslideMapActivated;

            if (vm.hazardBtn.isLandslideMapActivated) {
                showHazardSpinner('Landslide');
                hazardMapServices.loadLandslideLayer();
                return;
            }

            hazardMapServices.hideLandslideLayer();
            alertServices.showToast('Landslide layer deactivated', 'bottom right');
        }

        function toggleFaultLineLayer() {
            vm.hazardBtn.isFaultLineActivated = !vm.hazardBtn.isFaultLineActivated;

            if (vm.hazardBtn.isFaultLineActivated) {
                showHazardSpinner('Fault line');
                hazardMapServices.loadFaultLines();
                return;
            }

            hazardMapServices.hideFaultLines();
            alertServices.showToast('Fault line layer deactivated', 'bottom right');
        }

        function toggleStormSurgeLayer() {
            vm.hazardBtn.isStormSurgeActivated = !vm.hazardBtn.isStormSurgeActivated;

            if (vm.hazardBtn.isStormSurgeActivated) {
                showHazardSpinner('Storm Surge');
                hazardMapServices.loadStormSurgeLayer(1);
                return;
            }

            hazardMapServices.hideStormSurgeLayer();
            alertServices.showToast('Storm Surge layer deactivated', 'bottom right');
        }

        function initialize () {
            $rootScope.$on(FILTER_ADDRESS_RESULT_RETURNED, function(e, params){
                console.log('FILTER_ADDRESS_RESULT_RETURNED: ',params);

                if (vm.constructionBtn.isEnabled) {
                    // show construction markers
                    var bounds = params.geometry && params.geometry.viewport
                                ? params.geometry.viewport
                                : gmapServices.map.getBounds();

                    getConstructionStatusData(bounds);
                }
            });

            $rootScope.$on(TILES_LOADED, function(e, params){
                alertServices.showToast(params.layer + ' layer successfully loaded', 'bottom right');
            });

            //var epsg4326 = new proj4.Proj('EPSG:4326');
            //var epsg3857 = new proj4.Proj('EPSG:3857');
            //var geoJSONOBJ4 = new proj4.Point(13467592.887621775, 1629025.9468136765);
            //var result = proj4.transform(epsg3857, epsg4326, geoJSONOBJ4);
            //var result1 = proj4.transform(epsg3857, epsg4326, new proj4.Point(13470038.8725269, 1631471.931718802));
            //console.log('result:  ',result);

            //var url = 'http://202.90.159.177/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=flood_5:Flood5_2017April21&TILED=true&WIDTH=256&HEIGHT=256&CRS=EPSG:4326&STYLES';
            //gmapServices.loadGeoServerTiles(url, 1);
        }

        initialize();
    }
}());