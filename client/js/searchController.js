/**
 * Controle for player page
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'localStorage', 'requests', '$location', 'providers',
        function ($scope, localStorage, requests, $location, providers) {

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


            function search() {
                var keywords = $scope.keywords;
                var provider = $scope.provider;

                if (keywords.length > 3) {
                    providers.doSearchRequest(keywords).then(
                        function(results){
                            $scope.results = results;
                        }
                    );
                }
            }
        }]);
