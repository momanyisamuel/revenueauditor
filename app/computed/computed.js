"use strict";

angular
  .module("income.computed", ["ngRoute", "chart.js", "siTable"])

  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider
        .when("/computed", {
          templateUrl: "computed/computed.html",
          controller: "ComputedCtrl"
        })
        .when("/computed/:incomeId", {
          templateUrl: "computed/computed-detail.html",
          controller: "ComputedCtrl"
        });
    }
  ])

  .controller("ComputedCtrl", [
    "$scope",
    "$routeParams",
    "$http",
    "getData",
    "$rootScope",
    "$location",

    function($scope, $routeParams, $http, getData, $rootScope, $location) {
      var ctrl = $rootScope;
      var month = 0;
      var year = 2015;
      var cdata = [];
      var ddata = [];
      var ldata = [];
      var sdata = [];
      var branchId = 0;
      var ip = $location.host();
      var host = "http://" + ip + ":8080/dashboard/";

      ctrl.setMonth = function(m) {
        month = m;
        new chart();
      };
      ctrl.setYear = function(y) {
        year = y;
      };
      ctrl.setBranchId = function(b) {
        console.log(b.branch.acbranchid)
        branchId = b.branch.acbranchid;
        new chart();
      };
      ctrl.setBranchIdDefault = function(b) {
        //console.log(b)
        branchId = b;
        new chart();
      };
      $http.get("/json/service.json").success(function(data) {
        $scope.incomes = [];
        for (var i = 0; i < data.length; i++) {
          //console.log(data[i].name)
          $scope.incomes.push(data[i]);
        }
      });

      $scope.contentShow = "second";
      // $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
      // 'node=selectrevenuetype&revenuetypeid=1').success(function(data){

      //     angular.forEach(data.data, function(item) {
      //         console.log(item.typeid)
      //          if (item.typeid == $routeParams.incomeId){
      //            $scope.income = item;
      //            console.log(item)
      //          }
      //        });
      //     $http.get('http://localhost:8080/dashboard/app/dbconnect/select.jsp?'+
      //     'node=selectnoninterestincomebranch'+
      //     '&year=0'+
      //     '&month=0'+
      //     '&typeid=0'+
      //     '&customerid=0'+
      //     '&branchid='+branchId).then(function (d) {

      //         var current = 0
      //         $scope.tables = []

      //         console.log(d.data.data)
      //         for (var i = 0; i < d.data.data.length; i++ ) {
      //           current = d.data.data[i].typeid
      //           if (current == $routeParams.incomeId) {
      //               //console.log(d.data.data[i])

      //               var tables = $scope.tables.push(d.data.data[i])
      //               //console.log($scope.tables)

      //             }
      //         }
      //     })
      // });

      $http.get("json/branch.json").then(function(data) {
        //console.log(data.data)

        $scope.branches = [];
        for (var i = 0; i < data.data.length; i++) {
          //console.log(data.data[i])
          if (data.data[i].branchname !== null || undefined) {
            $scope.branches.push(data.data[i]);
            //console.log(data.data[i].branchname)
            // if (data.data[i].id == 1) {
          }

          // }
        }
      });
      function addCommas(nStr) {
        nStr += "";
        var x = nStr.split(".");
        var x1 = x[0];
        var x2 = x.length > 1 ? "." + x[1] : "";
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + "," + "$2");
        }
        return x1 + x2;
      }

      function getTotals(data) {
        var total = 0;
        for (var i = 0; i < data.length; i++) {
          total = total + data[i] / 1;
        }
        return total.toFixed(0);
      }
      //make object list global
      function initialize(obj, objca, objcla, objv) {
        //$(".chart").hide()
        loadLineChart(obj, objca, objcla, objv);
      }
      //take param obj and create line chart
      function loadLineChart(obj, objca, objcla, objv) {
        var ctx = obj.getContext("2d");
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
        };
        new Chart(ctx, {
          type: "line",
          data: ChartData
        });
        var totald = getTotals(ddata);
        var totalc = getTotals(cdata);
        objca.innerHTML = addCommas(totald);
        objcla.innerHTML = addCommas(totalc);
        objv.innerHTML =
          (((totald / 1 - totalc / 1) / totald / 1) * 100)
            .toFixed(2)
            .toString() + "%";
        loadScatterChart();
        loadMaps();
        //$scope.loading = false;
      }

      function loadScatterChart() {
        var ctx = document.getElementById("scatter_item").getContext("2d");
        ctx.canvas.width = 870;
        ctx.canvas.height = 200;
        var ChartData = {
          datasets: [
            {
              label: "Variance Analysis",
              borderColor: "rgba(221, 74, 56,1)",
              backgroundColor: "rgba(221, 74, 56,0.2)",
              data: sdata
            }
          ]
        };

        var scatterChart = new Chart(ctx, {
          type: "scatter",
          data: ChartData
        });

        //scatterChart.destroy();
      }
      // function to load map
      function loadMaps() {
        var center = new google.maps.LatLng(6.465422, 3.406448);

        var map = new google.maps.Map(document.getElementById("map_canvas"), {
          zoom: 4,
          center: center
        });

        var currentRequest = null;

        var currentRequest = $http
          .get("json/branch.json")
          .success(function(response) {
            console.log(response);
            var data = response;
            console.log(data);
            var locations = [];
            var infowindow = new google.maps.InfoWindow();
            var marker;
            var eventListener1;
            var eventListener2;
            var eventListener3;
            // var mapData = []
            function getImage(variance) {}
            for (var i = 0; i < data.length; i++) {
              //console.log(data.data[i].latitude)

              // var circleIcon = {
              //     path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
              //     fillColor: '#FF0000',
              //     fillOpacity: .6,
              //     strokeWeight: 0,
              //     scale: 1
              // };
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(
                  data[i].latitude,
                  data[i].longitude
                ),
                map: map,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 6,
                  fillColor: "#FF0000",
                  fillOpacity: 0.4,
                  strokeWeight: 0.4
                }
              });
              eventListener1 = google.maps.event.addListener(
                marker,
                "click",
                (function(marker, i) {
                  return function() {
                    map.setZoom(12);
                    map.setCenter(marker.getPosition());
                    branchId = data[i].id;
                    //lineItems(hdnViewId.value);
                  };
                })(marker, i)
              );
              eventListener2 = google.maps.event.addListener(
                marker,
                "click",
                (function(marker, i) {
                  return function() {
                    infowindow.setContent(data[i].branchname);
                    infowindow.open(map, marker);
                  };
                })(marker, i)
              );
              eventListener3 = google.maps.event.addListener(
                infowindow,
                "closeclick",
                function(marker, i) {
                  map.setZoom(5);
                  map.setCenter(center);
                  branchId = 0;
                  //lineItems(hdnViewId.value);
                }
              );
            }
          });
      }

      // function to loop through data and create object list
      var chart = function() {
        //$scope.loading = true;
        $http.get("json/chart.json").success(function(d) {
          console.log(d);
          //var data = JSON.parse(d);
          //console.log(data);

          var current = "0";
          var previous = "0";
          var labels = [];
          var clientData = [];
          var computedData = [];
          var bankamount = [];
          var scatter = [];
          for (var prop in d[0]) {
            console.log(prop);
          }

          for (var i = 0; i < d.length; i++) {
            console.log("list:" + d[i].parentlistid);
            current = d[i].parentlistid;
            if ((current != previous && i != 0) || d.length == i + 1) {
              var c = "graph_item_" + previous;
              var ca = "computed_amount_" + previous;
              var cla = "client_amount_" + previous;
              var v = "difference_total_" + previous;
              var obj = document.getElementById(c);
              var objca = document.getElementById(ca);
              var objcla = document.getElementById(cla);
              var objv = document.getElementById(v);
              cdata = clientData;
              ddata = computedData;
              ldata = labels;
              sdata = scatter;
              if (obj != null) initialize(obj, objca, objcla, objv);
              labels = [];
              clientData = [];
              computedData = [];
            }
            labels.push(d[i].day + "/" + d[i].month + "/2019");
            clientData.push(d[i].BankAmount);
            computedData.push(d[i].AuditAmount);
            sdata.push({ x: d[i].BankAmount, y: d[i].AuditAmount });
            previous = current;
          }
        });
      };
      new chart();
    }
  ])
  //service to fetch data from server
  .factory("getData", [
    "$http",
    function($http) {
      function getIncomeData() {
        return $http.get(
          "http://localhost:8080/dashboard/app/dbconnect/select.jsp?" +
            "node=selectrevenuetype" +
            "&@revenuetypeid=1"
        );
      }
      function getChartData(month, year, branchId) {
        return $http.get(
          "http://localhost:8080/dashboard/app/dbconnect/select.jsp?" +
            "node=selectnoninterestincomedate" +
            "&year=" +
            year +
            "&month=" +
            month +
            "&branchid=" +
            branchId +
            "&customerid=0"
        );
      }

      return { getIncomeData: getIncomeData, getChartData: getChartData };
    }
  ]);
