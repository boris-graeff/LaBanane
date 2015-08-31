angular.module('LaBanane.services')
    .factory('soundcloud', ['$window', '$rootScope', '$interval', '$q', 'constants',
        function ($window, $rootScope, $interval, $q, constants) {

            var service = $rootScope.$new(true);
            service.sound = null;

            SC.initialize({
                client_id: constants.SOUNDCLOUD_KEY
            });

            service.play = function () {
                if (service.sound !== null) {
                    service.lastPosition = 0;
                    service.sound.play({
                        whileplaying: function () {
                            if ((this.position - service.lastPosition) > 420) {
                                service.lastPosition = this.position;
                                $rootScope.$emit(constants.EVENTS.TRACK_PROGRESS, this.position / this.duration *100);
                                $rootScope.$apply();
                            }
                        },
                        onfinish: function () {
                            $rootScope.$emit(constants.EVENTS.TRACK_END, '');
                        }
                    });
                }
            };

            service.pause = function () {
                if(service.sound){
                    service.sound.pause();
                }
            };

            service.stop = function () {
                if (this.sound != null) {
                    this.sound.destruct();
                    this.sound = null;
                }
            };

            service.loadSong = function (url, volume) {
                var deferred = $q.defer();

                SC.stream("/tracks/" + url, function (sound) {
                    service.stop();
                    service.sound = sound;
                    service.sound.setVolume(volume);

                    deferred.resolve();
                });

                return deferred.promise;
            };

            service.setVolume = function (volume) {
                if (this.sound !== null) {
                    this.sound.setVolume(volume);
                }
            };

            service.getVolume = function () {
                return (this.sound.volume);
            };

            service.seek = function (percentage) {
                this.sound.setPosition(percentage/100 * this.sound.duration);
            };

            service.doSearchRequest = function (keywords) {
                var deferred = $q.defer();

                SC.get('/tracks', {q: keywords, limit: constants.MAX_RESULTS}, function (tracks) {
                    var results = [];

                    for (var i in tracks) {
                        var track = tracks[i],
                            artwork = track.artwork_url;

                        results.push({
                            'index'     : i,
                            'id'        : track.id,
                            'name'      : track.title,
                            'provider'  : 'soundcloud',
                            'artwork'   : (artwork) ? artwork.replace('large', 't500x500') : '' // TODO : add default image
                        });
                    }

                    $rootScope.$apply(function () {
                        deferred.resolve(results);
                    });
                });


                return deferred.promise;
            };

            return service;
        }]);