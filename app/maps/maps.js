'use strict';

angular.module('income.maps', ['ngRoute','chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/maps', {
    templateUrl: 'maps/maps.html',
    controller: 'MapsCtrl'
  });
}])
//contoller to display data in detail by geoJSON
.controller('MapsCtrl', ['$scope','$routeParams','$http','$filter','getData',function($scope, $routeParams, $http, $filter,getData) {
    var ctrl= $scope;
    var month = 7;
    var year = 2015;
    var cdata = [];
    var ddata = [];
    var ldata = [];
    var sdata = [];
    var vdata = []
    var branchId = 0;
    var ip = location.host;
    var host = 'http://'+ip+':8080/dashboard/';
    console.log(vdata)
    ctrl.setMonth = function (m) {
      console.log(m)
      month = m
      new chart;
    }
    ctrl.setYear = function (y) {
      console.log(y)
      year = y

    }
    ctrl.setBranchId = function (b) {
      console.log(b.branch.id)
      branchId = b.branch.id;
      new chart;
    }
    ctrl.setBranchIdDefault = function (b) {
      console.log(b)
      branchId = b;
      new chart;
    }
    getData.getIncomeData().then(function (data) {
          $scope.incomes = data.data['data'];
    });
  
    $scope.contentShow = 'second';
    //load branches    
   // $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
   //  'node=selectnoninterestincomebranch'+
   //  '&year=0'+
   //  '&month=0'+
   //  '&typeid=0'+
   //  '&customerid=0'+
   //  '&branchid='+branchId).then(function (data) {
   //      console.log(data.data.data)
   //      $scope.branches = data.data.data;

   //      $scope.orderList = data.data.data.typeid
   //  });
    //add commas to figures
    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    //get account toatals
    function getTotals(data){
        var total = 0;
        for(var i = 0 ; i < data.length; i++){
          total = total + data[i]/1;
        }
        return total.toFixed(0)
    }
    //make object list global
    
    $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
    'node=selectnoninterestincomebranch&year=2015&month=7&branchid=0&typeid=0&customerid=0').then(function (data) {
      console.log(data)
    
      var cities = []
      for (var i = 0; i < data.data.data.length; i++) {
        cities.push({"city":data.data.data[i].branchname,"desc":data.data.data[i].AccountName,"lat":data.data.data[i].latitude,"long":data.data.data[i].longitude})
        console.log(data.data.data[i].branchname)
      }

      console.log(cities)


      var mapOptions = {
          zoom: 4,
          center: new google.maps.LatLng(0.1540843, 35.65117),
          mapTypeId: google.maps.MapTypeId.TERRAIN
      }

      $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

      $scope.markers = [];

      var infoWindow = new google.maps.InfoWindow();

      var createMarker = function (cities){
          
          var marker = new google.maps.Marker({
              map: $scope.map,
              position: new google.maps.LatLng(cities.lat, cities.long),
              title: cities.city
          });
          marker.content = '<div class="infoWindowContent">' + cities.desc + '</div>';
          
          google.maps.event.addListener(marker, 'click', function(){
              infoWindow.setContent('<h4>' + marker.title + '</h4>' + marker.content);
              infoWindow.open($scope.map, marker);
          });
          
          $scope.markers.push(marker);
          
      }  

      for (var i = 0; i < cities.length; i++){
          createMarker(cities[i]);
      }

      $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
      }



    })
    

}])
//service to fetch data from server
.factory('getData',['$http', function ($http) {
    function getIncomeData (){
      return $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
        'node=selectlist'+
        '&parentlistid=5'
      );
    }
    function getChartData(month, year, branchId) {
      return $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
        'node=selectnoninterestincome'+
        '&month='+month+
        '&year='+year+
        '&glacc='+
        '&branchid='+branchId+
        '&day=0'
      );
    }

    return {getIncomeData:getIncomeData, getChartData:getChartData}
}]);
