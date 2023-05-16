'use strict';

angular.module('income.menu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/menu', {
    templateUrl: 'menu/menu.html',
    controller: 'MenuCtrl'
  });
}])

.controller('MenuCtrl', ['$http','$scope',function($scope,$http) {



}]);
