(function () {
    'use strict';

    angular
        .module('demoApp.operations', [])

        .constant('POI_TYPES', [
            {
                type: 'police',
                icon: 'stars',
                label: 'Police Station',
                markerIcon: 'police_pinlet-2-medium.png',
                color: '#e74c3c',
            },
            {
                type: 'fire_station',
                icon: 'whatshot',
                label: 'Fire Station',
                markerIcon: 'civic_bldg_pinlet-2-medium_red.png',
                color: '#e74c3c',
            },
            {
                type: 'hospital',
                icon: 'add_circle',
                label: 'Hospital',
                markerIcon: 'hospital_H_pinlet-2-medium.png',
                color: '#f88181',

            },
            {
                type: 'bank',
                icon: 'local_atm',
                label: 'Bank',
                markerIcon: 'bank_intl_pinlet-2-medium.png',
                color: '#909ce1',
            },
            {
                type: 'local_government_office',
                icon: 'account_balance',
                label: 'Government Office',
                markerIcon: 'civic_bldg_pinlet-2-medium.png',
                color: '#7b9eb0',
            }
        ])
    ;

}());
