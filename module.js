var app = angular.module("mySchedulerApp", ['ngRoute']);

app.factory('GlobalVariable', function() {
    return {
        hourly_pay : 6000,
        indexArray : [],
        eventArray : [],

        dataset : [],
        d3graph : [],
        eventNum : 0
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

            GlobalVariable.dataset.push({name : context.name, height: 10, width: context.workingTime});
            for (var i = 0, item; item = GlobalVariable.dataset[i]; i++) {
                item.height = 150 / GlobalVariable.dataset.length - 5;
            };

            console.log(GlobalVariable.dataset);
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
});

app.controller("d3GraphCtrl", function($scope, GlobalVariable){

    $scope.d3bar = GlobalVariable.dataset;

    var w=380;
    var h=100;

    var array = [14,52]
    var svg = d3.select("#d3bar");

    //console.log(svg);

    svg.selectAll('rect')
        .data($scope.d3bar)
        .enter();
        //.append('rect')
        //.attr('x', 0)
        //.attr('y', $scope.d3bar.height+5)
        //.attr('width', 20)
        //.attr('height', function (d) {
        //    return h+(d*4);
        //})
        //.attr('fill', 'blue');
});