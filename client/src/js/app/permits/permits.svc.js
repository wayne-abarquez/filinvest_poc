(function(){
'use strict';

angular.module('demoApp.permits')
    .factory('permitsServices', [permitsServices]);

    function  permitsServices() {
        var service = {};

        var permitKeys = [
            'Apply for the building',
            'Brgy Clearance',
            'LGU Zoning/Location Clearance',
            'LLDA Clearance',
            'DENR-ECC',
            'Preliminary Approval and Location Clearance (PALC)',
            'HLURB Development Permit',
            'Certificate of Registration',
            'HLURB Temporary LTS',
            'HLURB LTS',
            'Status of Construction',
            'Per building',
            'Fire Safety (FSIC)',
            'Bldg Permit',
            'COC HLURB',
            'CEI',
            'Occupancy Permit'
        ];

        service.getPermitData = getPermitData;

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getPermitData() {
            return permitKeys.map(function(item){
                return {
                    permits: item,
                    status: getRandomInt(0,100)
                };
            })
        }

        return service;
    }
}());