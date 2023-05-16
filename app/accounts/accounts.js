'use strict';

angular.module('income.accounts', ['ngRoute','chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/accounts', {
    templateUrl: 'accounts/accounts.html',
    controller: 'AccountsCtrl'
  });
}])

.controller('AccountsCtrl', ['$scope','$routeParams','$http','$filter',function($scope, $routeParams, $http, $filter) {
  
$http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?node=selectlist&parentlistid=5').success(function(data){
  console.log(data.data);

  $scope.incomes = data.data;

});


}]);
//contoller to display data in detail by geoJSON
// .controller('AccountsCtrl', ['$scope','$routeParams','$http','$filter',function($scope, $routeParams, $http, $filter) {
    
// 	$http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?node=selectlist&parentlistid=5').success(function(data){
//     console.log(data.data[0].account);

//     angular.forEach(data.data, function(item) {
//          if (item.id == $routeParams.incomeId){
//            $scope.income = item;
//            console.log(item)
//          }
//        });
// 		//$scope.income = $filter('filter')(data.data[0].account);

//   });
  

// }]);
