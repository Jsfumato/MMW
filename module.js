var app = angular.module("mySchedulerApp", ['ngRoute']);

app.factory('GlobalVariable', function() {
    return {
        hourly_pay : 6000,
        indexArray : [],
        eventArray : [],

        dataset : [],
        strbuffer : [{points : ""}],
        d3graph : [],

        inven : [],
        eventNum : 0,

        d3pie :
            function(d3) {
                'use strict';

                var dataset = [
                    { label: 'Abulia', width: 10 },
                    { label: 'Betelgeuse', width: 20 },
                    { label: 'Cantaloupe', width: 30 },
                    { label: 'Dijkstra', width: 40 }
                ];
                var width = 380;
                var height = 160;
                var radius = Math.min(width, height) / 2;

                var color = d3.scale.category20b();
                var svg = d3.select('.d3')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + (width / 2) +
                    ',' + (height / 2) + ')');

                var arc = d3.svg.arc()
                    .outerRadius(radius);

                var pie = d3.layout.pie()
                    .value(function(d) { return d.width; })
                    .sort(null);

                var path = svg.selectAll('path')
                    .data(pie(dataset))
                    .enter()
                    .append('path')
                    .attr('d', arc)
                    .attr('fill', function(d, i) {
                        return color(d.data.label);
                    });
            }(window.d3)

    };
});

app.controller("ScheduleTableCtrl", function($scope, GlobalVariable) {

    $scope.indexArray = GlobalVariable.indexArray;

    $scope.rows = [
        {time: "AM 06", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "AM 07", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "AM 08", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "AM 09", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "AM 10", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "AM 11", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 12", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 01", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 02", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 03", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 04", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 05", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 06", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 07", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 08", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 09", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 10", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "PM 11", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
    ];

    $scope.active = function($index){

        for(var i=0; i<GlobalVariable.indexArray.length; i++){
            if($index === GlobalVariable.indexArray[i]){
                GlobalVariable.indexArray.splice(i, 1);
                return;
            }
        }
        GlobalVariable.indexArray.push($index);
    };

    $scope.isSelected = function($index){
        for(var i=0; i<GlobalVariable.indexArray.length; i++){
            if($index === GlobalVariable.indexArray[i]){
                return true;
            }
        }
        return false
    }

    $scope.addEvent = function() {

        if($scope.employeeName === undefined || GlobalVariable.indexArray.length === 0){
            console.log("ERROR::NoName || NoEvent");
        }

        else {
            var context = {};
            context.id = GlobalVariable.eventNum;
            context.name = $scope.employeeName;

            var minIndex = 0;
            var maxIndex = 0;

            for (var i = 0; i < GlobalVariable.indexArray.length; i++) {
                if (GlobalVariable.indexArray[i] < GlobalVariable.indexArray[minIndex]) {
                    minIndex = i;
                }
                if (GlobalVariable.indexArray[i] > GlobalVariable.indexArray[minIndex]) {
                    maxIndex = i;
                }
            }

            context.min = GlobalVariable.indexArray[minIndex];
            context.max = GlobalVariable.indexArray[maxIndex];
            context.workingTime = context.max - context.min + 1;
            context.totalPay = GlobalVariable.hourly_pay * context.workingTime;

            GlobalVariable.dataset.push(
                {name : context.name, height: 10, width: context.workingTime}
            );

            GlobalVariable.strbuffer[0].points = "";

            for (var i = 0, item; item = GlobalVariable.dataset[i]; i++) {
                item.height = 160 / GlobalVariable.dataset.length - 5;

                GlobalVariable.strbuffer[0].points += item.width*30 + " ";
                GlobalVariable.strbuffer[0].points += (i*(item.height+5) + (item.height)/2) + " ";
            };

            console.log(GlobalVariable.strbuffer[0].points);

            GlobalVariable.eventArray.push(context);
        }

        console.log(GlobalVariable.eventArray);
        GlobalVariable.indexArray = [];
        $scope.indexArray = GlobalVariable.indexArray;

        $scope.employeeName = "";
    };
});

app.controller("EventListCtrl", function($scope, GlobalVariable) {

    $scope.employees = GlobalVariable.eventArray;

});

app.controller("barGraphCtrl", function($scope, GlobalVariable){

    $scope.bargraph = GlobalVariable.dataset;
    $scope.path = GlobalVariable.strbuffer[0];

});

app.controller("d3Chart1Ctrl", function($scope, GlobalVariable){

    //GlobalVariable.d3pie();

});

app.controller("inventoryCtrl", function($scope, GlobalVariable){

    $scope.inventory = GlobalVariable.inven;

    var inputError = function(){
        console.log("start");
        $("#itemError").removeClass("hidden");
        setTimeout(function(){
            $("#itemError").addClass("hidden")
        },2000);

        $scope.itemName = "";
        $scope.num = "";

        console.log("%c물품 목록 입력값이 유효하지 않습니다.", "font-size:12px; color:red;");
    }

    $scope.addItem = function(){

        var num = parseInt($scope.num);

        if( Number.isNaN(num) || $scope.itemName === "" || $scope.num === "" ){
            inputError();
            return;
        }

        var context = {
            name : $scope.itemName,
            num : num
        };

        GlobalVariable.inven.push(context);

        $scope.itemName = "";
        $scope.num = "";
    };

    $scope.modifyItem = function($event){

        var btn = $event.currentTarget;
        var hiddenOpt = $(btn).closest(".itemElement").children("#modify");

        hiddenOpt.toggleClass("hidden");
    };

    $scope.saveChange = function($event, item){

        item.name = $scope.newItemName;
        item.num = $scope.newNum;

        var btn = $event.currentTarget;
        var hiddenOpt = $(btn).closest("#modify");

        hiddenOpt.addClass("hidden");
    };

    $scope.deleteItem = function($event){

        var btn = $event.currentTarget;

        btn.closest(".itemElement").remove();
        console.log($event.currentTarget);
    };
});