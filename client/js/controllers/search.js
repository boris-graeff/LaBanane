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
                $scope.provider = 'youtube';
                provider = youtube;
            };

            /**
             * Set soundcloud as provider
             */
            $scope.setSoundcloudProvider = function () {
                $scope.provider = 'soundcloud';
                provider = soundcloud;
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
