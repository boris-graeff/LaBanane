angular.module('LaBanane.services')
    .factory('youtube', ['$window', '$rootScope', '$interval', '$q', 'constants',
        function ($window, $rootScope, $interval, $q, constants) {

            var timeupdater = null;
            var service = $rootScope.$new(true);


            // Youtube callback when API is ready
            $window.onYouTubeIframeAPIReady = function () {
                service.player = service.createPlayer("null");
                service.ready = true;
            };

            $window.googleApiClientReady = function () {
                gapi.client.setApiKey(constants.YOUTUBE_KEY);
                window.setTimeout(loadAPIClientInterfaces, 1);
            };

            $window.loadAPIClientInterfaces = function () {
                gapi.client.load('youtube', 'v3', function () {
                });
            };


            // Chargements des APIs

            $.getScript('https://www.youtube.com/iframe_api');
            $.getScript('https://apis.google.com/js/client.js?onload=googleApiClientReady');

            // --------------------------


            service.playerId = null;
            service.player = null;
            service.ready = false;

            service.bindVideoPlayer = function (elementId) {
                service.playerId = elementId;
            };

            service.createPlayer = function (videoId) {

                return new YT.Player(this.playerId, {
                    height: '0',
                    width: '0',
                    videoId: videoId,
                    events: {
                        'onStateChange': service.onPlayerStateChange
                    }
                });
            };

            service.onReady = function () {
                this.player.addEventListener('onStateChange', function () {
                    service.onPlayerStateChange();
                });
            };

            function updateTime() {
                $rootScope.$emit(constants.EVENTS.TRACK_PROGRESS, service.player.getCurrentTime() / service.player.getDuration() * 100);
            }

            service.onPlayerStateChange = function (event) {
                if (event.data === 0) { // ended
                    $interval.cancel(timeupdater);
                    timeupdater = null;
                    $rootScope.$emit(constants.EVENTS.TRACK_END, '');
                }
                else if (event.data === 1) { // playing
                    if (timeupdater !== null) {
                        $interval.cancel(timeupdater);
                        timeupdater = null;
                    }
                    timeupdater = $interval(updateTime, 420);
                }
                else if (event.data === 2) { // paused
                    $interval.cancel(timeupdater);
                    timeupdater = null;
                }
            };

            service.loadSong = function (videoId) {
                var deferred = $q.defer();

                // API ready?
                if (this.ready && this.playerId) {
                    if (this.player) {
                        this.player.loadVideoById(videoId);
                    }
                }

                deferred.resolve();

                return deferred.promise;
            };

            service.play = function () {
                this.player.playVideo();
            };

            service.pause = function () {
                this.player.pauseVideo();
            };

            service.seek = function (percentage) {
                var allowSeekAhead = true;
                this.player.seekTo(percentage/100 * this.player.getDuration(), allowSeekAhead);
            };

            service.mute = function () {
                this.player.mute();
            };

            service.unmute = function () {
                this.player.unmute();
            };

            service.setVolume = function (volume) {
                if (this.player != null) {
                    this.player.setVolume(volume);
                }
            };

            service.getVolume = function () {
                return this.player.getVolume();
            };

            service.doSearchRequest = function (keywords) {
                var deferred = $q.defer();
                var youtubeResources = [];

                if (gapi.client.youtube !== undefined) {
                    var request = gapi.client.youtube.search.list({
                        q: keywords,
                        key: constants.YOUTUBE_KEY,
                        part: 'snippet',
                        maxResults: constants.MAX_RESULTS,
                        type: 'video'
                    });

                    request.execute(function (response) {

                        for (var i in response.result.items) {
                            var item = response.result.items[i];
                            youtubeResources.push({
                                'index': i,
                                'id': item.id.videoId,
                                'name': item.snippet.title,
                                'provider': 'youtube'
                            });
                        }

                        $rootScope.$apply(function () {
                            deferred.resolve(youtubeResources);

                        });
                    });
                }

                return deferred.promise;
            };

            return service;
        }]);
