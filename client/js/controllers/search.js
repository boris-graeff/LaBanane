/**
 * Search controller.
 */
angular.module('LaBanane').
    controller('SearchCtrl', ['$scope', 'soundcloud', 'youtube', '$q',
        function ($scope, soundcloud, youtube, $q) {

            $scope.results = [];

            /**
             * Search tracks on youtube and soundcloud, then merge, rate and sort results.
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
                            result.rate = rate(result.name, splitKeywords);
                            ratedResults.push(result);
                        });

                        console.dir("rate");
                        console.dir(ratedResults);
                        $scope.results = _.sortBy(ratedResults, 'rate');
                        console.dir($scope.results);
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