(function(){
'use strict';

angular.module('demoApp.permits')
    .controller('sidePanelController', ['$mdSidenav', '$timeout', 'propertyServices', 'permitsServices', sidePanelController]);

    function sidePanelController ($mdSidenav, $timeout, propertyServices, permitsServices) {
        var vm = this;

        vm.form = {};

        vm.table = {
          header: ['permits', 'status']
        };

        vm.result = {
            headerImageSrc: '/images/properties/studio-city/Studio-City-Logo.jpg',
            permits: [],
            completion: {
                tower: 'Tower 3',
                completionPercentage: 41,
                date: 'May 2016',
                imageSrc: '/images/properties/studio-city/construction-update/Studio-City_construction_update_website_may2016_01.jpg'
            }
        };

        vm.toggleSidenav = toggleSidenav;


        function toggleSidenav() {
            $mdSidenav('sidePanel')
                .toggle();
        }

        function initialize () {
            vm.result.permits = permitsServices.getPermitData();

            propertyServices.loadProperties()
                .then(function () {
                    propertyServices.setBoundsFromProperties();
                    $timeout(function () {
                        toggleSidenav();
                    }, 100);
                });
        }

        initialize();
    }
}());