/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'searchService',
        function ($scope, localStorage, requests, $location, searchService) {

            $scope.provider = 'soundcloud';
            $scope.results = [];

            /**
             * Set youtube as provider
             */
            $scope.setYoutubeProvider = function () {
                $scope.provider = 'youtube';
            };

            /**
             * Set soundcloud as provider
             */
            $scope.setSoundcloudProvider = function () {
                $scope.provider = 'soundcloud';
            };

            /**
             * Search on selected provider
             */
            $scope.search = function () {
                if ($scope.keywords.length > 3) {
                    var promiseSearch = searchService.doSearchRequest($scope.provider, $scope.keywords);
                    promiseSearch.then(function (results) {
                        $scope.results = results;
                    });
                }
            };
        }]);
