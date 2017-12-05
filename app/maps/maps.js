'use strict';

angular.module('myApp.maps', ['ngRoute','chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/maps', {
    templateUrl: 'maps/maps.html',
    controller: 'MapsCtrl'
  });
}])
//contoller to display data in detail by geoJSON
.controller('MapsCtrl', ['$scope','$routeParams','$http','$filter',function($scope, $routeParams, $http, $filter) {

  loadMaps()
  
  var magnitude = [200, 20.5, 30, 70,90, 80, 60.4, 20, 14, 3, 11]

  function loadMaps() {
    var map = new google.maps.Map(document.getElementById('map_canvas'), {
      zoom: 6,
      center: {lat: 10.14193168613103, lng: 8.26171875}
    });
  }
    
	$http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?node=selectlist&parentlistid=5').success(function(data){
    console.log(data.data[0].account);

    angular.forEach(data.data, function(item) {
         if (item.id == $routeParams.incomeId){
           $scope.income = item;
           console.log(item)
         }
       });
		//$scope.income = $filter('filter')(data.data[0].account);

  });
  

}]);
