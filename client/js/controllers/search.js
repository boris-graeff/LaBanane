/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'soundcloud', 'youtube',
        function ($scope, localStorage, requests, $location, soundcloud, youtube) {

            var provider = soundcloud;
            $scope.provider = 'soundcloud';
            $scope.results = [];

            /**
             * Set youtube as provider
             */
            $scope.setYoutubeProvider = function () {
                if($scope.provider !== 'youtube'){
                    $scope.provider = 'youtube';
                    provider = youtube;
                    $scope.results.length = 0;
                    $scope.search();
                }
            };

            /**
             * Set soundcloud as provider
             */
            $scope.setSoundcloudProvider = function () {
                if($scope.provider !== 'soundcloud'){
                    $scope.provider = 'soundcloud';
                    provider = soundcloud;
                    $scope.results.length = 0;
                    $scope.search();
                }
            };

            /**
             * Search on selected provider
             */
            $scope.search = function () {
                if ($scope.keywords.length > 3) {
                    var promiseSearch = provider.doSearchRequest($scope.keywords);
                    promiseSearch.then(function (results) {
                        $scope.results = results;
                    });
                }
            };
        }]);
