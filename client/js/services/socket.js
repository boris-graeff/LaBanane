angular.module('LaBanane.services')
    .factory('socket', ['socketFactory', function (socketFactory) {
        return socketFactory();
    }]);