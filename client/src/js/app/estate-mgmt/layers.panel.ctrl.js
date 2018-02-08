(function(){
'use strict';

angular.module('demoApp.estateMgmt')
    .controller('layersPanelController', ['$mdSidenav', 'webServices', 'layersServices', layersPanelController]);

    function layersPanelController ($mdSidenav, webServices, layersServices) {
        var vm = this;

        vm.layers = [];

        vm.toggleLayer = toggleLayer;
        vm.reload = reload;
        vm.closeSidenav = closeSidenav;


        function toggleLayer(flag, item) {
            if (flag) {
                layersServices.loadLayers(item);
            } else {
                layersServices.hideLayers(item);
            }
        }

        function reload() {
        }

        function closeSidenav() {
            $mdSidenav('layerPanel')
                .close();
        }

        function init(layers) {
            layers.forEach(function(item, index){
                layers[index].model = false;
            });

            if (layers.children && layers.children.length) {
                init(layers);
            }
        }

        function initialize () {
            webServices.getLayersData()
                .then(function(result){
                    vm.layers = [].concat(result);
                    init(vm.layers);
                });
        }

        initialize();
    }
}());