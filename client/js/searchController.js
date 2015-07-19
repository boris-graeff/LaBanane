/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'providers', 'soundCloudService',
        function ($scope, localStorage, requests, $location, providers, soundCloudService) {

            $scope.isSoundcloudProvider = true;
            $scope.isYoutubeProvider = false;
            $scope.results = [];

            /**
             * Set youtube as provider
             */
            $scope.setYoutubeProvider = function () {
                $scope.isSoundcloudProvider = false;
                $scope.isYoutubeProvider = true;
            };

            /**
             * Set soundcloud as provider
             */
            $scope.setSoundcloudProvider = function () {
                $scope.isYoutubeProvider = false;
                $scope.isSoundcloudProvider = true;
            };

            /**
             * Search on selected provider
             */
            $scope.search = function () {
                if ($scope.keywords.length > 3) {
                    if($scope.isSoundcloudProvider){ // Soundcloud provider
                        var promiseSearch = soundCloudService.doSearchRequest($scope.keywords);
                        promiseSearch.then(function (data) {
                            $scope.results = data;
                        });
                    }
                    else { // Youtube provider
                        // TODO
                    }
                }
            };

        }]);
