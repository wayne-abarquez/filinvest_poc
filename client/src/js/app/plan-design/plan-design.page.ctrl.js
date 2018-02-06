(function(){
'use strict';

angular.module('demoApp.planDesign')
    .controller('planDesignPageController', ['$rootScope', '$q', '$scope', 'FILTER_ADDRESS_RESULT_RETURNED', 'TILES_LOADED', 'hazardMapServices', 'planDesignServices', 'alertServices', 'gmapServices', '$interval', planDesignPageController]);

    function planDesignPageController($rootScope, $q, $scope, FILTER_ADDRESS_RESULT_RETURNED, TILES_LOADED, hazardMapServices, planDesignServices, alertServices, gmapServices, $interval) {
        var vm = this;

        vm.showHazardDial = false;

        vm.hazardBtn = {
            isFloodMapActivated: false,
            isLandslideMapActivated: false,
            isFaultLineActivated: false,
            isStormSurgeActivated: false
        };

        vm.constructionBtn = {
            isEnabled: false
        };

        vm.legend = {
            construct: {},
            hazard: {
                show: false,
                flood: {
                    srcImage: '/images/plan-and-design/inundation-legend.png'
                },
                landslide: {
                    srcImage: '/images/plan-and-design/landslide-legend.png'
                },
                faultline: {
                    srcImage: '/images/plan-and-design/faultline-legend.png'
                },
                stormsurge: {
                    srcImage: '/images/plan-and-design/inundation-legend.png'
                }
            },
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

        function showHazardLegend(layer) {
            if (!vm.legend.hazard.show) vm.legend.hazard.show = true;
            if (!vm.legend.hazard[layer].show) vm.legend.hazard[layer].show = true;
        }

        function hideHazardLegend(layer) {
            if (vm.legend.hazard[layer].show) vm.legend.hazard[layer].show = false;

            vm.legend.hazard.show = false;

            vm.legend.hazard.show = _.reduce(vm.legend.hazard, function (val, item) {
                return  val || (item.show || false);
            });
        }

        function getConstructionStatusData(bounds) {
            var dfd = $q.defer();

            planDesignServices.showConstructionStatusMarkersByBounds(bounds.toUrlValue(), $scope)
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
                // show legend
                vm.legend.construct.show = true;
            } else {
                // hide markers
                // reset list
                planDesignServices.resetMapObjects();
                vm.result = [];
                // hide legend
                vm.legend.construct.show = false;
            }

        }

        function toggleFloodMap() {
            vm.hazardBtn.isFloodMapActivated = !vm.hazardBtn.isFloodMapActivated;

            if (vm.hazardBtn.isFloodMapActivated) {
                showHazardSpinner('Flood');
                showHazardLegend('flood');
                hazardMapServices.loadFloodMap();
                return;
            }

            hideHazardLegend('flood');
            hazardMapServices.hideFloodMap();
            alertServices.showToast('Flood layer deactivated', 'bottom right');
        }

        function toggleLandslideLayer() {
            vm.hazardBtn.isLandslideMapActivated = !vm.hazardBtn.isLandslideMapActivated;

            if (vm.hazardBtn.isLandslideMapActivated) {
                showHazardSpinner('Landslide');
                showHazardLegend('landslide');
                hazardMapServices.loadLandslideLayer();
                return;
            }

            hideHazardLegend('landslide');
            hazardMapServices.hideLandslideLayer();
            alertServices.showToast('Landslide layer deactivated', 'bottom right');
        }

        function toggleFaultLineLayer() {
            vm.hazardBtn.isFaultLineActivated = !vm.hazardBtn.isFaultLineActivated;

            if (vm.hazardBtn.isFaultLineActivated) {
                showHazardSpinner('Fault line');
                showHazardLegend('faultline');
                hazardMapServices.loadFaultLines();
                return;
            }

            hideHazardLegend('faultline');
            hazardMapServices.hideFaultLines();
            alertServices.showToast('Fault line layer deactivated', 'bottom right');
        }

        function toggleStormSurgeLayer() {
            vm.hazardBtn.isStormSurgeActivated = !vm.hazardBtn.isStormSurgeActivated;

            if (vm.hazardBtn.isStormSurgeActivated) {
                showHazardSpinner('Storm Surge');
                showHazardLegend('stormsurge');
                hazardMapServices.loadStormSurgeLayer(1);
                return;
            }

            hideHazardLegend('stormsurge');
            hazardMapServices.hideStormSurgeLayer();
            alertServices.showToast('Storm Surge layer deactivated', 'bottom right');
        }

        function closest(num, arr) {
            var curr = arr[0];
            var diff = Math.abs (num - curr);
            for (var val = 0; val < arr.length; val++) {
                var newdiff = Math.abs (num - arr[val]);
                if (newdiff < diff) {
                    diff = newdiff;
                    curr = arr[val];
                }
            }
            return curr;
        }

        function cleanUp() {
            planDesignServices.resetMapObjects();
        }

        var updateSliderInterval;

        function initialize () {
            vm.legend.construct = {
                data: planDesignServices.getLegend()
            };

            $rootScope.$on(FILTER_ADDRESS_RESULT_RETURNED, function(e, params){
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

            var selection = [41, 80, 94, 99];

            $(document).on('change', '#construct-completion-input-range', function(){
                var propertyId = $(this).data('propertyid');
                var value = $(this).val();
                var closestValue = closest(value, selection);
                //$(this).val(closestValue);

                var index = selection.indexOf(closestValue);

                planDesignServices.updateConstructInfoboxContent(propertyId, index);
            });

            $(document).on('click', '.construct-infowindow .play', function () {
                $(this).hide();
                $('.construct-infowindow .stop').css('display', 'inline-block');

                var propertyId = $('#construct-completion-input-range').data('propertyid');

                var index = 0;

                updateSliderInterval = $interval(function(){
                    if (index >= selection.length) index = 0;
                    $('#construct-completion-input-range').val(selection[index]);
                    planDesignServices.updateConstructInfoboxContent(propertyId, index);
                    index++;
                }, 2000, false);

            });

            $(document).on('click', '.construct-infowindow .stop', function () {
                $(this).hide();
                $('.construct-infowindow .play').css('display', 'inline-block');

                if (updateSliderInterval) $interval.cancel(updateSliderInterval);
            });

            $scope.$on('$destroy', cleanUp);

            //var flag = _.map(vm.legend.hazard, function(item, key){
            //    console.log('item: ',item, ' key: ', key);
            //    return item.key && item[key].show ? item[key].show : false;
            //});

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