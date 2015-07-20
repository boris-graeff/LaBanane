/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('LaBanane.services', []).

    factory('socket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }]).
    factory('localStorage', [function () {
        return {
            getArray : getArray,
            push : push,
            pushTemp : pushTemp,
            getValue : getValue
        };

        // Public methods

        function getArray(itemKey) {
            var item = window.localStorage.getItem(itemKey);
            return item ? JSON.parse(item) : [];
        }

        function push(itemKey, entryKey, entryValue) {
            var item = window.localStorage.getItem(itemKey);
            item = item ? JSON.parse(item) : {};
            item[entryKey] = entryValue;

            window.localStorage.setItem(itemKey, JSON.stringify(item));
        }

        function getValue(itemKey, entryKey) {
            var item = window.localStorage.getItem(itemKey);
            item = item ? JSON.parse(item) : {};
            return item[entryKey];
        }

        function pushTemp(itemKey, entry, limit) {
            var item = window.localStorage.getItem(itemKey);
            item = item ? JSON.parse(item) : [];

            for (var i = 0; i < item.length; ++i) {
                if (item[i] === entry) {
                    item.splice(i, 1);
                    break;
                }
            }

            item.unshift(entry);
            item = item.slice(0, limit);

            window.localStorage.setItem(itemKey, JSON.stringify(item));
        }
    }]).


    factory('requests', ['$http', function ($http) {

        return {
            getAllPlaylists : getAllPlaylists,
            getPlaylist : getPlaylist,
            createPlaylist : createPlaylist
        };

        // Public methods

        function getAllPlaylists() {
            var request = $http({
                method : 'get',
                url : 'services/playlist/all'
            });

            return request.then(handleSuccess, handleError);
        }

        function getPlaylist (name, password) {
            var request = $http({
                method : 'get',
                url : 'services/playlist/content/' + name + '/' + password
            });

            return request.then(handleSuccess, handleError);
        }

        function createPlaylist (name, password) {
            var request = $http({
                method : 'post',
                url : 'services/playlist/create',
                data : {
                    name: name,
                    password: password
                }
            });

            return request.then(handleSuccess, handleError);
        }

        // Private methods

        function handleError(response){
            // Server error, normalize format
            if (! angular.isObject( response.data ) ||
                ! response.data.message) {

                return( $q.reject( "An unknown error occurred." ) );

            }

            // Otherwise, use expected error message.
            return( $q.reject( response.data.message ) );
        }

        function handleSuccess(response){
            return response.data;
        }
    }])

    .factory('soundCloudService', ['$window', '$rootScope', '$interval', '$q', 'constants',
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
                        results.push({'index': i, 'provider-id': track.id, 'name': track.title, 'provider': 'soundcloud'});
                    }

                    $rootScope.$apply(function () {
                        console.log("results 1");
                        console.log(results);
                        deferred.resolve(results);
                    });
                });


                return deferred.promise;
            };

            return service;
        }]);
