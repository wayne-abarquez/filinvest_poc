(function () {
    'use strict';

    angular
        .module('demoApp.gsn', [])

        .constant('GSN_TYPES', [
            {
                type: 'campaign',
                icon: 'record_voice_over',
                markerIcon: 'campaign_marker.png'
            },
            {
                type: 'sales',
                icon: 'people',
                markerIcon: 'people_ic_red.png'
            },
            {
                type: 'leads and prospect',
                icon: 'phone',
                markerIcon: 'phone_ic_green.png'
            }
        ])
    ;

}());
