// Declare app level module which depends on filters, and services

    angular.module('LaBanane.controllers', []);
    angular.module('LaBanane.services', []);

    angular.module('LaBanane', [
        'LaBanane.controllers',
        'LaBanane.filters',
        'LaBanane.services',
        'LaBanane.directives',
        'LaBanane.constants',

        // 3rd party dependencies
        'btford.socket-io',
        'ngRoute',
        'ngTouch'
    ]).
        config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider.
                when('/app', {
                    templateUrl: 'partials/home',
                    controller: 'HomeCtrl'
                }).
                when('/player/:name', {
                    templateUrl: 'partials/player',
                    controller: 'PlayerCtrl'
                }).
                otherwise({
                    redirectTo: '/app'
                });

            $locationProvider.html5Mode(true);
        }])
        .run(['$rootScope', '$location', function ($rootScope, $location) {
            $rootScope.$watch(function () {
                    return $location.path();
                },
                function (url) {
                    ga('send', 'pageview', {
                        page: url
                    });
                });
        }]);
