/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'soundCloudService',
        function ($scope, localStorage, requests, $location, soundCloudService) {

            var providerService = soundCloudService;
            $scope.provider = 'soundcloud';
            $scope.results = [];

            /**
             * Set youtube as provider
             */
            $scope.setYoutubeProvider = function () {
                $scope.provider = 'youtube';
                providerService = youtubeService;
            };

            /**
             * Set soundcloud as provider
             */
            $scope.setSoundcloudProvider = function () {
                $scope.provider = 'soundcloud';
                providerService = soundCloudService;
            };

            /**
             * Search on selected provider
             */
            $scope.search = function () {
                if ($scope.keywords.length > 3) {
                    var promiseSearch = providerService.doSearchRequest($scope.keywords);
                    promiseSearch.then(function (results) {
                        console.log("results 2");
                        console.log(results);

                        $scope.results = results;
                    });
                }
            };
        }]);
