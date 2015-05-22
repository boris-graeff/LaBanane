/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('LaBanane.services', []).
  factory('socket', ['socketFactory', function (socketFactory) {
    return socketFactory();
  }]).
    factory('localStorage', [function () {
      var localStorage = {};

      localStorage.getArray = function(item){
        var array = window.localStorage.getItem(item);
        //return array ? JSON.parse(array) : [];
        return ["test", "sdgsdgsdg", "sdgsdgsdg dfds"]
      };

      return localStorage;
    }]).
  value('version', '0.1');
