(function(){
'use strict';

angular.module('demoApp.estateMgmt')
    .controller('estateMgmtPageController', ['$timeout', '$scope', 'propertyServices', 'layersServices', '$mdSidenav', estateMgmtPageController]);

    function estateMgmtPageController($timeout, $scope, propertyServices, layersServices, $mdSidenav) {
        var vm = this;

        var panelId = 'layerPanel';

        vm.toggleLayerPanel = toggleLayerPanel;

        function toggleLayerPanel () {
            $mdSidenav(panelId)
                .toggle();
        }

        function cleanUp() {
            layersServices.hideLayers();
            propertyServices.reset(true);
        }

        function initialize () {
            propertyServices.loadProperties()
                .then(function () {
                    propertyServices.setBoundsFromProperties();
                    $timeout(function () {
                        toggleLayerPanel();
                    }, 100);
                });

            $scope.$on('$destroy', cleanUp);
        }

        initialize();
    }
}());