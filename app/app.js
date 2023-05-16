'use strict';

// Declare app level module which depends on views, and components
angular.module('income', [
  'ngRoute',
  'income.variance',
  'income.computed',
  'income.accounts',
  'income.maps'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/computed'});
}]);
