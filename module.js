var app = angular.module("mySchedulerApp", ['ngRoute']);

app.factory('GlobalVariable', function() {
    return {
        hourly_pay : 6000,
        indexArray : [],
        eventArray : [],

        dataset : [],
        strbuffer : [{points : ""}],
        piepoints : [],

        inven : [],
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

//      스케줄러 관련 연산

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
                {name : context.name, width: context.workingTime}
            );

            GlobalVariable.piepoints.push({
                name : context.name, value : context.workingTime,
                point : "", theta : 0, point_x : 0, point_y : 0
            });

//      svg chart를 위한 연산
//      자료 갯수에 따라서 chart내의 bar의 높이를 조절

            for (var i = 0, item; item = GlobalVariable.dataset[i]; i++) {
                item.height = 160 / GlobalVariable.dataset.length - 5;
                //totalValue += GlobalVariable.dataset[i].width;
            }

//      자료 갯수에 따라서 pie chart내의 내부 rad 조절
            var totalValue = 0;

            for (var i = 0, item; item = GlobalVariable.piepoints[i]; i++){
                totalValue += item.value;
            }

            for (var i = 0, item; item = GlobalVariable.piepoints[i]; i++){
                var preValue = 0;
                for (var j = 0; j<i; j++){
                    preValue += GlobalVariable.piepoints[j].value;
                }

                item.prevRad = "rotate(" +(180/Math.PI)*(2 * Math.PI * preValue/totalValue)+" 190 80)";
                console.log(item.prevRad);

                //item.theta = 2 * Math.PI * (item.value/totalValue);는 100%이기에 circle을 만들지 못한다.
                //소숫점 둘째 자리에서 반올림하여 100%는 아닌, 근사치를 구하여 data가 하나인 경우에도 원을 생성하도록 수정.
                
                item.theta = Math.round((2 * Math.PI * (item.value/totalValue))*100)/100;

                console.log(item.theta);
                item.point_x = 80 * Math.sin(item.theta);
                item.point_y =  80 * Math.cos(item.theta);
                console.log(item.point_x+", "+item.point_x);

                if(item.theta < Math.PI){
                    item.point = "M 190 0 A 80 80 0 0 1 " + (190+item.point_x) + " " + (80-item.point_y) + " L 190 80 Z"
                }else{
                    item.point = "M 190 0 A 80 80 0 1 1 " + (190+item.point_x) + " " + (80-item.point_y) + " L 190 80 Z"
                }
            }

//      line chart의 각 line의 끝 점을 이어주는 path를 생성한다.
            GlobalVariable.strbuffer[0].points = "";

            for (var i = 0, item; item = GlobalVariable.dataset[i]; i++) {
                if (i === 0) {
                    GlobalVariable.strbuffer[0].points += "M " + 0 + " ";
                    GlobalVariable.strbuffer[0].points += (i * (item.height + 5) + (item.height) / 2) + " L ";
                };

                GlobalVariable.strbuffer[0].points += item.width * 30 + " ";
                GlobalVariable.strbuffer[0].points += (i * (item.height + 5) + (item.height) / 2) + " ";

                if (i === GlobalVariable.dataset.length - 1) {
                    GlobalVariable.strbuffer[0].points += 0 + " ";
                    GlobalVariable.strbuffer[0].points += (i * (item.height + 5) + (item.height) / 2) + " Z";
                };
            }
            //console.log(GlobalVariable.strbuffer[0].points);

            GlobalVariable.eventArray.push(context);
        };

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

    $scope.legend = [
        { x1 : "30px", y1 : "160px", x2 : "30px", y2 : "155px"},
        { x1 : "60px", y1 : "160px", x2 : "60px", y2 : "155px"},
        { x1 : "90px", y1 : "160px", x2 : "90px", y2 : "155px"},
        { x1 : "120px", y1 : "160px", x2 : "120px", y2 : "155px"},
        { x1 : "150px", y1 : "160px", x2 : "150px", y2 : "150px"},
        { x1 : "180px", y1 : "160px", x2 : "180px", y2 : "155px"},
        { x1 : "210px", y1 : "160px", x2 : "210px", y2 : "155px"},
        { x1 : "240px", y1 : "160px", x2 : "240px", y2 : "155px"},
        { x1 : "270px", y1 : "160px", x2 : "270px", y2 : "155px"},
        { x1 : "300px", y1 : "160px", x2 : "300px", y2 : "150px"},
        { x1 : "330px", y1 : "160px", x2 : "330px", y2 : "155px"},
        { x1 : "360px", y1 : "160px", x2 : "360px", y2 : "155px"},
    ];
});

app.controller("pieChartCtrl", function($scope, GlobalVariable){

    $scope.piechart = GlobalVariable.piepoints;

    //.attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

});

app.controller("d3pieCtrl", function($scope, GlobalVariable){

    (function(d3) {

        var dataset = [
            { label: 'Abulia', value: 10 },
            { label: 'Betelgeuse', value: 20 },
            { label: 'Cantaloupe', value: 30 },
            { label: 'Dijkstra', value: 40 }
        ];

        var width = 380;
        var height = 160;
        var radius = Math.min(width, height) / 2;

        var color = d3.scale.category20b();
        var svg = d3.select('.pie')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

        var arc = d3.svg.arc()
            .outerRadius(radius);

        var pie = d3.layout.pie()
            .value(function(d) { return d.value; })
            .sort(null);

        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.label);
            });
    }(window.d3))
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
        $scope.itemQuantity = "";

        console.log($scope.itemName, $scope.itemQuantity);
        console.log("%c물품 목록 입력값이 유효하지 않습니다.", "font-size:12px; color:red;");
    }

    $scope.addItem = function(){

        var quantity = parseInt($scope.itemQuantity);

        if( Number.isNaN(quantity) || $scope.itemName === "" || $scope.num === "" ){
            inputError();
            return;
        }

        var context = {
            name : $scope.itemName,
            quantity : quantity
        };

        GlobalVariable.inven.push(context);

        $scope.itemName = "";
        $scope.itemQuantity = "";
    };

    $scope.modifyItem = function($event){

        var btn = $event.currentTarget;
        var hiddenOpt = $(btn).closest(".itemElement").children(".modify");

        hiddenOpt.toggleClass("hidden");
    };

    $scope.saveChange = function($event, item){

        item.name = $scope.newItemName;
        item.num = $scope.newItemQuantity;

        var btn = $event.currentTarget;
        var hiddenOpt = $(btn).closest(".modify");

        hiddenOpt.addClass("hidden");
    };

    $scope.deleteItem = function($event){

        var btn = $event.currentTarget;

        btn.closest(".itemElement").remove();
        console.log($event.currentTarget);
    };
});