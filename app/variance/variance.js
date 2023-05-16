'use strict';

angular.module('income.variance', ['ngRoute','chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/variance', {
    templateUrl: 'variance/variance.html',
    controller: 'VarianceCtrl'
  }).when('/variance/:incomeId', {
    templateUrl: 'variance/variance-detail.html',
    controller: 'VarianceCtrl'
  });
}])

.controller('VarianceCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  'getData',
  '$rootScope',

  function($scope, $routeParams, $http, getData, $rootScope) {
    var ctrl= $rootScope;
    var month = 5;
    var year = 2015;
    var cdata = [];
    var ddata = [];
    var ldata = [];
    var sdata = [];
    var vdata = []
    var branchId = 0;
    var ip = location.host;
    var host = 'http://'+ip+':8080/dashboard/';

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
    $http.get('http://localhost:8080/dashboard/app/json/chart.json').success(function (data) {

          $scope.incomes = []
          
          console.log(data.data)
          for (var i = 0; i < data.data.length; i++) {
            console.log(data.data[i].AccountName)
            $scope.incomes.push(data.data[i]);
          }
          
    });

    $scope.contentShow = 'second';
    $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
    'node=selectrevenuetype&revenuetypeid=1').success(function(data){
    
        angular.forEach(data.data, function(item) {
            console.log(item.typeid)
             if (item.typeid == $routeParams.incomeId){
               $scope.income = item;
               console.log(item)
             }
           });
        $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
        'node=selectnoninterestincomebranch'+
        '&year=0'+
        '&month=0'+
        '&typeid=0'+
        '&customerid=0'+
        '&branchid='+branchId).then(function (d) {

            var current = 0
            $scope.tables = []
            $scope.viewby = 5;
            $scope.totalItems = d.data.data.length
            $scope.currentpage = 4
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 5;

            console.log(d.data.data)
            for (var i = 0; i < d.data.data.length; i++ ) {
              current = d.data.data[i].typeid
              if (current == $routeParams.incomeId) {
                  //console.log(d.data.data[i])

                  var tables = $scope.tables.push(d.data.data[i])
                  $scope.incomeTable = new NgTableParams({page: 1,count: 5},{
                    getData:function(params){
                      $defer.resolve(tables.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                      params.total(tables.length);
                    },
                    total: d.data.data[i].length

                  })
                  //console.log($scope.tables)
                  
                  
                }
            }
        })
    });
    
    $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
    'node=selectbranch&branchid='+branchId).then(function (data) {
        console.log(data.data.data)
        $scope.branches = data.data.data;
    });
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

    function getTotals(data){
        var total = 0;
        for(var i = 0 ; i < data.length; i++){
          total = total + data[i]/1;
        }
        return total.toFixed(0)
    }
    //make object list global
    function initialize(obj,objca, objcla, objv) {
        //$(".chart").hide()
        loadLineChart(obj,objca, objcla, objv)
    }
    //take param obj and create line chart
    function loadLineChart(obj, objca, objcla, objv) {
      var ctx = obj.getContext("2d")
      //var randomScalingFactor = function () { return Math.round(Math.random() * 100) };
      var ChartData = {
          labels: ldata,
          datasets: [
                        {
                            label: "Computed",
                            backgroundColor: "rgba(51,122,183,0.2)",
                            strokeColor: "rgba(51,122,183,1)",
                            pointBackgroundColor: "rgba(51,122,183,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(51,122,183,1)",
                            data: vdata
                        }
          ]
      }
      new Chart(ctx,{
        type: "line",
        data: ChartData
      });
      var totald = getTotals(ddata)
      var totalc = getTotals(cdata)
      objca.innerHTML = addCommas(totald)
      objcla.innerHTML = addCommas(totalc)
      objv.innerHTML = ((totald/1-totalc/1)/totald/1*100).toFixed(2).toString()+"%"
      loadScatterChart();
      loadMaps()
      //$scope.loading = false;
    }

    //createmap
    // $scope.initMap = function (data) {
    //     var mapOptions = {
    //         zoom: 4,
    //         center: new google.maps.LatLng(10.14193168613103, 8.26171875),
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     }
    //     var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    // }
    // $scope.initMap();
    //create scatter chart
    function loadScatterChart() {
      var ctx = document.getElementById('scatter_item').getContext("2d")
      var ChartData = {
               datasets: [{
                   label: 'Variance Analysis',
                   borderColor: "rgba(221, 74, 56,1)",
                   backgroundColor: "rgba(221, 74, 56,0.2)",
                   data: sdata
                 }]
               }

      new Chart(ctx,{
        type: "scatter",
        data: ChartData
      });

    }
    // function to load map
    function loadMaps() {
      var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 4,
        center: new google.maps.LatLng(10.14193168613103, 8.26171875),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      var currentRequest = null;
      var currentRequest = jQuery.ajax({
      url: 'http://localhost:8080/dashboard/app/dbconnect/select.jsp?node=selectbranch&branchid='+branchId,
      beforeSend: function () {
        if(currentRequest != null) {
          currentRequest.abort();
        }
      },
      complete: function () {},
      data: 'branchid='+branchId,
      datatype: 'json',
      success: function (response) {
                var data = JSON.parse(response);
                var locations = [];
                var infowindow = new
                google.maps.InfoWindow();
                var marker
                var center = new google.maps.LatLng(9.483989, 8.419135);
                var eventListener1
                var eventListener2
                var eventListener3
                for (var i = 0; i < data.data.length; i++) {
                  marker = new google.maps.Marker({
                  position: new google.maps.LatLng(data.data[i].latitude, data.data[i].longitude),
                  map: map,
                  icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 6,
                      fillColor: "#FF0000",
                      fillOpacity: 0.4,
                      strokeWeight: 0.4
                  }
              });
              eventListener1 = google.maps.event.addListener(marker, 'click', (function (marker, i) {
                  return function () {
                      map.setZoom(12);
                      map.setCenter(marker.getPosition());
                      branchId= data.data[i].id
                      //lineItems(hdnViewId.value);
                  }
              })(marker, i));
              eventListener2 = google.maps.event.addListener(marker, 'click', (function (marker, i) {
                  return function () {
                      infowindow.setContent(data.data[i].desc);
                      infowindow.open(map, marker);
                  }
              })(marker, i));
              eventListener3 = google.maps.event.addListener(infowindow, 'closeclick', (function (marker, i) {
                  map.setZoom(6);
                  map.setCenter(center);
                  branchId = 0
                  //lineItems(hdnViewId.value);
              }));
            }
          }
        })
      }


    // function to loop through data and create object list
    var chart = function (){
      //$scope.loading = true;
      $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
        'node=selectnoninterestincomedate&'+
        'year='+year+
        '&month='+month+
        '&branchid='+branchId+
        '&customerid=0').success(function (d) {
          console.log(d)
          //var data = JSON.parse(d);
          //console.log(data);

            var current     = '0'
            var previous    = '0'
            var labels          = []
            var clientData      = []
            var computedData    = []
            var bankamount = []
            var scatter = []
            var varianceData = []
          //  for(var prop in d.data.data){
          //    console.log(prop)
          //  }

            for (var i = 0; i < d.data.data.length; i++) {
              console.log("list:"+d.data.data[i].glacc);
              current = d.data.data[i].glacc;
              if((current != previous && i != 0) || d.data.data.length == i+1){
                var c = 'graph_item_' + previous;
                var ca = 'computed_amount_'+previous;
                var cla = 'client_amount_'+previous;
                var v = 'difference_total_'+previous;
                var obj = document.getElementById(c);
                var objca = document.getElementById(ca)
                var objcla = document.getElementById(cla)
                var objv = document.getElementById(v)
                cdata = clientData
                ddata = computedData
                vdata = varianceData
                ldata = labels
                sdata = scatter
                if(obj != null)
                  initialize(obj,objca, objcla, objv)
                labels =[]
                clientData = []
                computedData = []
                varianceData = []
              }
              labels.push(d.data.data[i].day);
              clientData.push(d.data.data[i].systemamount);
              computedData.push(d.data.data[i].computedamount);
              varianceData.push(d.data.data[i].variance);
              sdata.push({"x":d.data.data[i].variance,"y":d.data.data[i].computedamount});
              previous = current;
            }

    });
  }
  new chart;

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
