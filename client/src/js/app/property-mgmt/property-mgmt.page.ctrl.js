(function(){
'use strict';

angular.module('demoApp.propertyMgmt')
    .controller('propertyMgmtPageController', ['$timeout', '$scope', 'propertyServices', 'layersServices', '$mdSidenav', propertyMgmtPageController]);

    function propertyMgmtPageController($timeout, $scope, propertyServices, layersServices, $mdSidenav) {
        var vm = this;

        var panelId = 'propertiesPanel';

        vm.togglePanel = togglePanel;

        function togglePanel () {
            $mdSidenav(panelId)
                .toggle();
        }

        function cleanUp() {
            //layersServices.hideLayers();
            //propertyServices.reset(true);
        }

        function initialize () {
            //propertyServices.loadProperties()
            //    .then(function () {
            //        propertyServices.setBoundsFromProperties();
            //        $timeout(function () {
            //            toggleLayerPanel();
            //        }, 100);
            //    });
            //
            //$scope.$on('$destroy', cleanUp);
        }

        initialize();
    }
}());