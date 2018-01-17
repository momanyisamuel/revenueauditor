'use strict';

angular.module('income.computed', ['ngRoute','chart.js','ngTable'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/computed', {
    templateUrl: 'computed/computed.html',
    controller: 'ComputedCtrl'
  }).when('/computed/:incomeId', {
    templateUrl: 'computed/computed-detail.html',
    controller: 'ComputedCtrl'
  });
}])

.controller('ComputedCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  'getData',
  '$rootScope',
  '$location',
  'NgTableParams',

  function($scope, $routeParams, $http, getData, $rootScope, $location, NgTableParams) {
    var ctrl= $rootScope;
    var month = 5;
    var year = 2015;
    var cdata = [];
    var ddata = [];
    var ldata = [];
    var sdata = [];
    var branchId = 0;
    var ip = $location.host();
    // console.log(ip)
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
    getData.getIncomeData().then(function (data) {
          $scope.incomes = data.data['data'];
    });

    $scope.contentShow = 'second';
    
    
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
                            data: ddata
                        },
                        {
                            label: "Client",
                            backgroundColor: "rgba(221, 74, 56,0.2)",
                            strokeColor: "rgba(221, 74, 56,1)",
                            pointBackgroundColor: "rgba(221, 74, 56,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(221, 74, 56,1)",
                            data: cdata
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
      $scope.loading = false;
    }

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
        center: new google.maps.LatLng(9.483989, 8.419135),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      
      var currentRequest = null;
      var mData = []
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
                  var mapData = []
                  var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
                  function getImage(variance) {

                  }
                  for (var i = 0; i < data.data.length; i++) {

                    mapData.push({
                      "city":  {
                        "center": {"lat": parseFloat(data.data[i].latitude), "lng": parseFloat(data.data[i].longitude)},
                        "radius": 80000
                      }
                    }) 

                    mData = mapData
                     
                    var circleIcon = {
                        path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
                        fillColor: '#FF0000',
                        fillOpacity: .6,
                        strokeWeight: 0,
                        scale: 1
                    };
                    marker = new google.maps.Marker({
                      position: new google.maps.LatLng(data.data[i].latitude, data.data[i].longitude),
                      map: map,
                      icon: image
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

            //   for (var city in mData) {
            //     // Add the circle for this city to the map.
            //     //console.log(mData[city].city.center.lat)
            //     var cityCircle = new google.maps.Circle({
            //       strokeColor: '#FF0000',
            //       strokeOpacity: 0.8,
            //       strokeWeight: 2,
            //       fillColor: '#FF0000',
            //       fillOpacity: 0.35,
            //       map: map,
            //       center: new google.maps.LatLng(mData[city].city.center),
            //       radius: 80000
            //     });
            // }
            }
        })
      }


    // function to loop through data and create object list
    var chart = function (){
      $scope.loading = true;
      getData.getChartData(month,year, branchId).then(function (d) {
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
                ldata = labels
                sdata = scatter
                if(obj != null)
                  initialize(obj,objca, objcla, objv)
                labels =[]
                clientData = []
                computedData = []
              }
              labels.push(d.data.data[i].day);
              clientData.push(d.data.data[i].systemamount);
              computedData.push(d.data.data[i].computedamount);
              sdata.push({"x":d.data.data[i].variance,"y":d.data.data[i].computedamount});
              previous = current;
            }

    });
  }
  new chart;
$http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
    'node=selectlist&parentlistid=5').success(function(data){
        console.log(data.data[0]);
        angular.forEach(data.data, function(item) {
             if (item.account == $routeParams.incomeId){
               $scope.income = item;
               console.log(item) 
             }
             getData.getChartData(month,year, branchId).then(function (d) {
              var current     = '0'
              $scope.tables = []
              $scope.viewby = 5;
              $scope.totalItems = d.data.data.length
              $scope.currentpage = 4
              $scope.itemsPerPage = $scope.viewby;
              $scope.maxSize = 5;

              for (var i = 0; i < d.data.data.length; i++) {
                //console.log('list: '+d.data.data[i].computedamount)
                current = d.data.data[i].glacc
                
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
        //$scope.income = $filter('filter')(data.data[0].account);
        loadMaps()
    });

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
