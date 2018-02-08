(function(){
'use strict';

angular.module('demoApp.propertyMgmt')
    .controller('propertiesPanelController', ['$mdSidenav', '$timeout', 'propertyServices', 'modalServices', propertiesPanelController]);

    function propertiesPanelController ($mdSidenav, $timeout, propertyServices, modalServices) {
        var vm = this;

        var panelId = 'propertiesPanel';

        vm.list = [];


        vm.closeSidenav = closeSidenav;
        vm.addProperty = addProperty;

        function closeSidenav() {
            $mdSidenav(panelId)
                .close();
        }

        function addProperty() {
            closeSidenav();

            modalServices.showAddPropertyModal();
        }

        function initialize () {
            propertyServices.loadProperties()
                .then(function(result){
                    vm.list = result;

                    $timeout(function(){
                        $mdSidenav(panelId).open();
                    }, 500);
                });
        }

        initialize();
    }
}());