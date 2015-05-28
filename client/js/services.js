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

        function getPlaylist (id, password) {
            var request = $http({
                method : 'get',
                url : 'services/playlist/content/' + id + '/' + password
            });

            return request.then(handleSuccess, handleError);
        }

        function createPlaylist (id, password) {
            var request = $http({
                method : 'post',
                url : 'services/playlist/create',
                data : {
                    id: id,
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
    }]).

    factory('providers', [function () {
        return {
            doSearchRequest : doSearchRequest
        };

        // Public methods

        function doSearchRequest(keywords) {
            var item = window.localStorage.getItem(itemKey);
            return item ? JSON.parse(item) : [];
        }

    }]);
