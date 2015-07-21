angular.module('LaBanane.services')
    .factory('soundCloud', ['$window', '$rootScope', '$interval', '$q', 'constants',
        function ($window, $rootScope, $interval, $q, constants) {

            var service = $rootScope.$new(true);
            service.sound = null;
            service.lastPosition = 0;

            SC.initialize({
                client_id: constants.SOUNDCLOUD_KEY
            });

            service.play = function () {

                if (service.sound != null) {
                    service.sound.play({
                        whileplaying: function () {
                            if ((this.position - service.lastPosition) > 500) {
                                service.lastPosition = this.position;
                                $rootScope.$emit('service.timeUpdate', this.position / this.duration);
                            }
                        },
                        onfinish: function () {
                            $rootScope.$emit('service.songEnd', "");
                        }
                    });
                }
            };

            service.pause = function () {
                service.sound.pause();
            };

            service.stop = function () {
                if (this.sound != null) {
                    this.sound.destruct();
                    this.sound = null;
                }
            };

            service.loadSong = function (url) {
                var deferred = $q.defer();

                SC.stream("/tracks/" + url, function (sound) {
                    service.stop();
                    service.sound = sound;

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
                this.sound.setPosition(percentage * this.sound.duration);
            };

            service.doSearchRequest = function (keywords) {
                var deferred = $q.defer();

                SC.get('/tracks', {q: keywords, limit: constants.MAX_RESULTS}, function (tracks) {
                    var results = [];

                    for (var i in tracks) {
                        var track = tracks[i];
                        results.push({'index': i, 'id': track.id, 'name': track.title, 'provider': 'soundcloud'});
                    }

                    $rootScope.$apply(function () {
                        deferred.resolve(results);
                    });
                });


                return deferred.promise;
            };

            return service;
        }]);