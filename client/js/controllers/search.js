/**
 * Controler for search module
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'soundcloud', 'youtube', '$q',
        function ($scope, soundcloud, youtube, $q) {

            $scope.results = [];

            /**
             * Search on both providers
             */
            $scope.search = function () {
                var keywords = $scope.keywords;
                if (keywords.length > 3) {
                    var soundcloudSearch = soundcloud.doSearchRequest(keywords);
                    var youtubeSearch = youtube.doSearchRequest(keywords);
                    var splitKeywords = keywords.toLowerCase().split(' ');

                    $q.all([soundcloudSearch, youtubeSearch]).then(function (results) {

                        var ratedResults = [];
                        _.each(_.flatten(results), function (result) {
                            console.log(result);
                            result.rate = rate(result.name, splitKeywords);
                            // TODO : check si les deux ont un attribut 'name' commun
                            ratedResults.push(result);
                        });

                        $scope.results = _.sortBy(ratedResults, 'rate');
                    });
                }
            };

            /**
             * Rate result
             * @param result
             * @param keywords
             * @returns {number}
             */
            function rate(result, keywords) {

                // TODO : prendre en compte note youtube

                var rate = 100;
                _.each(keywords, function (keyword) {
                    if (result.search(keyword) > 0) {
                        rate = rate / 2;
                    }
                });

                return rate;
            }
        }]);