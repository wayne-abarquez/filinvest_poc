(function(){
'use strict';

angular.module('demoApp.planDesign')
    .factory('hazardMapServices', ['NOAH_GEOSERVER_BASE_URL', 'PHILVOCS_GEOSERVER_BASE_URL', 'BASE_MAP_INDEXES', 'TILES_LOADED', 'gmapServices', '$rootScope', hazardMapServices]);

    function hazardMapServices (NOAH_GEOSERVER_BASE_URL, PHILVOCS_GEOSERVER_BASE_URL, BASE_MAP_INDEXES, TILES_LOADED, gmapServices, $rootScope) {
        var service = {};

        var is3857 = true;

        var tiles = {},
            listeners = {};

        service.loadFloodMap = loadFloodMap;
        service.loadLandslideLayer = loadLandslideLayer;
        service.loadFaultLines = loadFaultLines;
        service.loadStormSurgeLayer = loadStormSurgeLayer;

        service.hideFloodMap = hideFloodMap;
        service.hideLandslideLayer = hideLandslideLayer;
        service.hideFaultLines = hideFaultLines;
        service.hideStormSurgeLayer = hideStormSurgeLayer;

        function loadFloodMap() {
            // initialize overlaymaptypes array
            gmapServices.initOverlayMapTypesArray();

            var url = NOAH_GEOSERVER_BASE_URL;
                url += '?SERVICE=WMS';
                url += '&REQUEST=GetMap';
                url += '&VERSION=1.3.0';
                url += '&FORMAT=image/png';
                url += '&TRANSPARENT=true';
                url += '&CRS=EPSG:3857';
                url += '&TILED=true';
                url += '&WIDTH=256&HEIGHT=256';
                url += '&STYLES';
                url += '&LAYERS=flood_5:Flood5_2017April21';

            tiles['flood'] = gmapServices.loadGeoServerTiles(url, BASE_MAP_INDEXES.flood, 'Flood', is3857);

            listeners['flood'] = gmapServices.addListener(tiles['flood'], 'tilesloaded', function () {
                console.log('Flood tiles successfully loaded');
                $rootScope.$broadcast(TILES_LOADED, {layer: 'Flood'});
            });
        }


        function loadLandslideLayer() {
            console.log('loading landslide tiles');

            // initialize overlaymaptypes array
            gmapServices.initOverlayMapTypesArray();

            var url = NOAH_GEOSERVER_BASE_URL;
            url += '?SERVICE=WMS';
            url += '&REQUEST=GetMap';
            url += '&VERSION=1.3.0';
            url += '&FORMAT=image/png';
            url += '&TRANSPARENT=true';
            url += '&CRS=EPSG:3857';
            url += '&TILED=true';
            url += '&WIDTH=256&HEIGHT=256';
            url += '&STYLES';
            url += '&LAYERS=LandslideHazards';

            tiles['landslide'] = gmapServices.loadGeoServerTiles(url, BASE_MAP_INDEXES.landslide, 'Landslide', is3857);

            listeners['landslide'] = gmapServices.addListener(tiles['landslide'], 'tilesloaded', function(){
                console.log('landslide tiles successfully loaded');
                $rootScope.$broadcast(TILES_LOADED, {layer: 'Landslide'});
            });
        }

        function loadFaultLines() {
            // initialize overlaymaptypes array
            gmapServices.initOverlayMapTypesArray();

            var url = PHILVOCS_GEOSERVER_BASE_URL;
                url += '?SERVICE=WMS';
                url += '&REQUEST=GetMap';
                url += '&VERSION=1.1.1';
                url += '&FORMAT=image/png';
                url += '&TRANSPARENT=true';
                url += '&SRS=EPSG:4326';
                url += '&WIDTH=256&HEIGHT=256';
                url += '&STYLES';
                url += '&LAYERS=active_fault_philippines';

            tiles['faultline'] = gmapServices.loadGeoServerTiles1(url, BASE_MAP_INDEXES.faultline, 'Fault Line');

            listeners['faultline'] = gmapServices.addListener(tiles['faultline'], 'tilesloaded', function () {
                console.log('Fault Line successfully loaded');
                $rootScope.$broadcast(TILES_LOADED, {layer: 'Fault line'});
            });
        }

        /**
         *
         * @param level - value: 1-4
         */
        function loadStormSurgeLayer(level) {
            console.log('loading storm surge tiles');

            // initialize overlaymaptypes array
            gmapServices.initOverlayMapTypesArray();

            var url = NOAH_GEOSERVER_BASE_URL;
            url += '?SERVICE=WMS';
            url += '&REQUEST=GetMap';
            url += '&VERSION=1.3.0';
            url += '&FORMAT=image/png';
            url += '&TRANSPARENT=true';
            url += '&CRS=EPSG:3857';
            url += '&TILED=true';
            url += '&WIDTH=256&HEIGHT=256';
            url += '&STYLES';
            url += '&LAYERS=SSA'+ level +'_Region';

            tiles['stormsurge'] = gmapServices.loadGeoServerTiles(url, BASE_MAP_INDEXES.stormsurge, 'Storm Surge', is3857);

            listeners['stormsurge'] = gmapServices.addListener(tiles['stormsurge'], 'tilesloaded', function () {
                console.log('storm surge tiles successfully loaded');
                $rootScope.$broadcast(TILES_LOADED, {layer: 'Storm Surge'});
            });
        }

        function hideLayer(index) {
            gmapServices.removeOverlayAtIndex(index);
        }

        function hideFloodMap() {
            hideLayer(BASE_MAP_INDEXES.flood);
        }

        function hideLandslideLayer() {
            hideLayer(BASE_MAP_INDEXES.landslide);
        }

        function hideFaultLines() {
            hideLayer(BASE_MAP_INDEXES.faultline);
        }

        function hideStormSurgeLayer() {
            hideLayer(BASE_MAP_INDEXES.stormsurge);
        }

        return service;
    }
}());