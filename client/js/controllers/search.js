/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'soundCloud', 'youtube',
        function ($scope, localStorage, requests, $location, soundCloud, youtube) {

            var providerService = soundCloud;
            $scope.provider = 'soundcloud';
            $scope.results = [];

            /**
             * Set youtube as provider
             */
            $scope.setYoutubeProvider = function () {
                $scope.provider = 'youtube';
                providerService = youtube;
            };

            /**
             * Set soundcloud as provider
             */
            $scope.setSoundcloudProvider = function () {
                $scope.provider = 'soundcloud';
                providerService = soundCloud;
            };

            /**
             * Search on selected provider
             */
            $scope.search = function () {
                if ($scope.keywords.length > 3) {
                    var promiseSearch = providerService.doSearchRequest($scope.keywords);
                    promiseSearch.then(function (results) {
                        $scope.results = results;
                    });
                }
            };
        }]);
