/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', ['$scope', 'socket', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }]).
  controller('MyCtrl1', ['$scope', 'socket', function ($scope, socket) {
    socket.on('send:time', function (data) {
      $scope.time = data.time;
    });
  }]).
  controller('MyCtrl2', ['$scope', function ($scope) {
    // write Ctrl here
  }]);
