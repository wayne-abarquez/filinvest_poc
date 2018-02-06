(function () {
    'use strict';

    angular.module('demoApp')
        .factory('modalServices', ['$q', '$mdDialog', '$mdMedia', '$rootScope', modalServices]);

    function modalServices($q, $mdDialog, $mdMedia, $rootScope) {
        var service = {};

        var customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        var modalObj;

        /* Service Functions */
        service.showPropertyDetailsModal = showPropertyDetailsModal;
        service.showPropertyGallery = showPropertyGallery;
        service.showFloorPlanGallery = showFloorPlanGallery;
        service.showUnitPlanGallery = showUnitPlanGallery;
        service.showUnitInteriorGallery = showUnitInteriorGallery;

        service.showAddPropertyModal = showAddPropertyModal;

        service.hideResolveModal = hideResolveModal;
        service.closeModal = closeModal;

        function showModal(modalObj, modalParams) {
            var dfd = $q.defer();
            if (modalObj) {
                dfd.reject("Modal already opened");
            } else {
                $rootScope.$broadcast("modal-opened");
                modalObj = $mdDialog.show(modalParams);
                modalObj.then(function (result) {
                        dfd.resolve(result);
                    }, function (reason) {
                        $rootScope.$broadcast("modal-dismissed");
                        dfd.reject(reason);
                    })
                    .finally(function () {
                        modalObj = null;
                    });
            }
            return dfd.promise;
        }

        function showPropertyDetailsModal(property_) {
            var opts = {
                controller: 'propertyDetailsController',
                controllerAs: 'vm',
                templateUrl: '/partials/selling/_property-details.modal.html',
                parent: angular.element(document.querySelector('#base-container')),
                openFrom: $('body #marker_info span.arrow')[0],
                hasBackdrop: false,
                locals: {property: property_},
                fullscreen: customFullscreen,
                onComplete: function (scope, element, options) {
                    $('.md-scroll-mask').css('z-index', '-1');
                }
            };
            return showModal(modalObj, opts);
        }

        function showPropertyGallery(property_) {
            var opts = {
                controller: 'propertyGalleryController',
                controllerAs: 'vm',
                templateUrl: '/partials/selling/_property-gallery.modal.html',
                hasBackdrop: true,
                locals: {property: property_},
                multiple: true,
                fullscreen: true,
                onComplete: function (scope, element) {
                    $('.md-scroll-mask').css('z-index', '-1');
                    //setTimeout(function(){
                    //    $('#fi-gallery-modal .fi-gallery.jk-carousel').resize();
                    //
                    //    //    $(element).closest('.md-dialog-container').resize();
                    ////    $('#fi-gallery-modal').resize();
                    //}, 200);
                },
                onShowing: function (scope, element) {
                    $(element).closest('.md-dialog-container').addClass('md-dialog-container-default');
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 1);
                },
                onRemoving: function (element, removePromise) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 80);
                    $(element).closest('.md-dialog-container').removeClass('md-dialog-container-default');
                }
            };
            return showModal(modalObj, opts);
        }

        function showFloorPlanGallery(property_) {
            var opts = {
                controller: 'propertyFloorPlanGalleryController',
                controllerAs: 'vm',
                templateUrl: '/partials/selling/_property-gallery.modal.html',
                hasBackdrop: true,
                locals: {property: property_},
                multiple: true,
                fullscreen: true,
                onComplete: function (scope, element) {
                    $('.md-scroll-mask').css('z-index', '-1');
                },
                onShowing: function (scope, element) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 1);
                    $(element).closest('.md-dialog-container').addClass('md-dialog-container-default');
                },
                onRemoving: function (element, removePromise) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 80);
                    $(element).closest('.md-dialog-container').removeClass('md-dialog-container-default');
                }
            };
            return showModal(modalObj, opts);
        }

        function showUnitPlanGallery(property_) {
            var opts = {
                controller: 'propertyUnitPlanGalleryController',
                controllerAs: 'vm',
                templateUrl: '/partials/selling/_property-gallery.modal.html',
                hasBackdrop: true,
                locals: {property: property_},
                multiple: true,
                fullscreen: true,
                onComplete: function (scope, element) {
                    $('.md-scroll-mask').css('z-index', '-1');
                },
                onShowing: function (scope, element) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 1);
                    $(element).closest('.md-dialog-container').addClass('md-dialog-container-default');
                },
                onRemoving: function (element, removePromise) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 80);
                    $(element).closest('.md-dialog-container').removeClass('md-dialog-container-default');
                }
            };
            return showModal(modalObj, opts);
        }

        function showUnitInteriorGallery(unitName, unitType) {
            var unit = {name: unitName, type: unitType};

            var opts = {
                controller: 'propertyUnitInteriorGalleryController',
                controllerAs: 'vm',
                templateUrl: '/partials/selling/_unit-interior-gallery.modal.html',
                hasBackdrop: true,
                locals: {unit: unit},
                multiple: true,
                fullscreen: true,
                onComplete: function (scope, element) {
                    $('.md-scroll-mask').css('z-index', '-1');
                },
                onShowing: function (scope, element) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 1);
                    $(element).closest('.md-dialog-container').addClass('md-dialog-container-default');
                },
                onRemoving: function (element, removePromise) {
                    $('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 80);
                    $(element).closest('.md-dialog-container').removeClass('md-dialog-container-default');
                }
            };
            return showModal(modalObj, opts);
        }

        function showAddPropertyModal() {
            var opts = {
                controller: 'addPropertyController',
                controllerAs: 'vm',
                templateUrl: '/partials/property-mgmt/_add-property.modal.html',
                hasBackdrop: false,
                //multiple: true,
                //fullscreen: true,
                onComplete: function (scope, element) {
                    $('.md-scroll-mask').css('z-index', '-1');
                },
                onShowing: function (scope, element) {
                    setTimeout(function(){
                        $('body #add-property-modal').closest('.md-dialog-container').addClass('md-dialog-container-half');

                    }, 200);
                    //$(element).closest('.md-dialog-container').addClass('md-dialog-container-default');
                },
                onRemoving: function (element, removePromise) {
                    $('body md-dialog#add-property-modal').closest('.md-dialog-container').removeClass('md-dialog-container-half');
                    //$('body md-dialog#property-details-modal').closest('.md-dialog-container').css('zIndex', 80);
                    //$(element).closest('.md-dialog-container').removeClass('md-dialog-container-default');
                }
            };
            return showModal(modalObj, opts);
        }

        function hideResolveModal(response) {
            $mdDialog.hide(response);
        }

        // Close Modal
        function closeModal() {
            $mdDialog.cancel();
        }

        return service;
    }
}());