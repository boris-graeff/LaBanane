/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'providers', 'soundcloudService',
        function ($scope, localStorage, requests, $location, providers, soundcloudService) {

          $scope.isSoundcloudProvider = true;
          $scope.isYoutubeProvider = false;

            $scope.setYoutubeProvider = function(){
                $scope.isSoundcloudProvider = false;
                $scope.isYoutubeProvider = true;
            };

            $scope.setSoundcloudProvider = function(){
                $scope.isYoutubeProvider = false;
                $scope.isSoundcloudProvider = true;
            };

            $scope.results = [
                {
                    'name': 'fqsfsdf'
                },
                {
                    'name': 'sfqsfqsfqsf'
                },
                {
                    'name': 'dgsdgsdg'
                },
                {
                    'name': 'zeesdgsdgsdg'
                },
                {
                    'name': 'zeesdgsdgsdg'
                },
                {'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'},{'name':'toto'}
            ];


            $scope.search = function () {
                if ($scope.keywords.length > 3) {
                    var promiseSearch = soundcloudService.doSearchRequest($scope.keywords);
                    promiseSearch.then(function (data) {
                        $scope.results = data;
                    });
                }
            }

        }]);
