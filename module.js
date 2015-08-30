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
        eventNum : 0,

        d3pie : 0
    };
});

app.controller("ScheduleTableCtrl", function($scope, GlobalVariable) {

    var isMouseDown = false;

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

    $scope.addEvent = function() {
        if($scope.employeeName === undefined || $scope.employeeName === "" || GlobalVariable.indexArray.length === 0) {

            var audio = new Audio("sounds-1058-worthwhile.mp3");
            audio.play();
            audio = null;

            $scope.errorByName = true;
            console.log("ERROR::NoName || NoEvent");
        }else{

            method.addEventDataset();
            method.adjustChart();
            method.makeChartPath();

            method.addD3PieChart();
            method.addD3BarChart();
            method.addD3LineChart();
            $scope.showPopup = false;
            $scope.errorByName = false;

            var audio = new Audio("sounds-1049-knob.mp3");
            audio.play();

        };
    };

    $scope.active = function($index){
        isMouseDown = true;
        for(var i= 0, item; item = GlobalVariable.indexArray[i]; i++){
            if($index === item){
                GlobalVariable.indexArray.splice(i, 1);
                return;
            }};
        GlobalVariable.indexArray.push($index);
    };

    $scope.over = function($index){
        if(isMouseDown === true){
            GlobalVariable.indexArray.push($index);
        }
    };

    $scope.stopMouseDown = function(){
        isMouseDown = false;
        $scope.showPopup = true;

        //드래그 불가 추가해야
    };

    $scope.cancelEvent = function(){
        GlobalVariable.indexArray = [];
        $scope.employeeName = "";
        $scope.showPopup = false;
        $scope.errorByName = false;
    }

    $scope.isSelected = function($index){
        for(var i= 0, item; item = GlobalVariable.indexArray[i]; i++){
            if($index === item){
                return true;
            }};
        return false;
    };

    var method = {

        addEventDataset : function() {

            var context = {};
            context.id = GlobalVariable.eventNum;
            context.name = $scope.employeeName;

            var minIndex = 0;
            var maxIndex = 0;

            for (var i = 0, item; item = GlobalVariable.indexArray[i]; i++) {
                if (item < GlobalVariable.indexArray[minIndex]) {
                    minIndex = i;
                }
                if (item > GlobalVariable.indexArray[maxIndex]) {
                    maxIndex = i;
                }
            }

            context.min = GlobalVariable.indexArray[minIndex];
            context.max = GlobalVariable.indexArray[maxIndex];
            console.log(context.max);
            console.log(context.min);
            context.workingTime = context.max - context.min + 1;
            context.totalPay = GlobalVariable.hourly_pay * context.workingTime;

            GlobalVariable.dataset.push(
                {name : context.name, width: context.workingTime}
            );

            GlobalVariable.piepoints.push({
                name : context.name, value : context.workingTime,
                point : "", theta : 0, point_x : 0, point_y : 0
            });

            GlobalVariable.eventArray.push(context);
            GlobalVariable.indexArray = [];
            $scope.indexArray = GlobalVariable.indexArray;
            $scope.employeeName = "";
        },

        adjustChart : function() {

        //자료 갯수에 따라서 chart내의 bar의 높이를 조절
            for (var i = 0, item; item = GlobalVariable.dataset[i]; i++) {
                item.height = 160 / GlobalVariable.dataset.length - 5;
                item.y = i*(item.height+5);
            }

        //자료 갯수에 따라서 pie chart내의 내부 rad 조절
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
        },

        makeChartPath : function() {

        //line chart의 각 line의 끝 점을 이어주는 path를 생성한다.
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
            };
        },

        addD3PieChart : function() {
            $(".pie").children("svg").remove();
            (function (d3) {

                var dataset = GlobalVariable.piepoints;

                var width = 380;
                var height = 160;
                var radius = Math.min(width, height) / 2;

                var svg = d3.select('.pie')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

                var arc = d3.svg.arc()
                    .outerRadius(radius);

                var pie = d3.layout.pie()
                    .value(function (d) {
                        return d.value;
                    })
                    .sort(null);

                console.log(dataset);

                if (dataset !== undefined) {
                    var path = svg.selectAll("path")
                        .data(pie(dataset))
                        .enter()
                        .append("path")
                        .attr("d", arc)
                        .attr("fill", "#6BB9F0")
                        .attr("stroke", "white")
                        .attr("stroke-width", "2px");
                }
            }(window.d3));
        },

        addD3BarChart : function() {
            $(".bar").children("svg").remove();
            (function (d3) {

                var dataset = GlobalVariable.dataset;

                var width = 380;
                var height = 160;

                var svg = d3.select('.bar')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                if (dataset !== undefined) {
                    var rect = svg.selectAll("rect")
                        .data(dataset)
                        .enter().append("rect")
                        .attr("fill", "#6BB9F0")
                        .attr("x", "0")
                        .attr("y", function(d) { return d.y; })
                        .attr("width", function(d) { return d.width*30; })
                        .attr("height", function(d) { return d.height; });

                    var text = svg.selectAll("text")
                        .data(dataset)
                        .enter().append("text")
                        .text(function(d) {return d.value;})
                        .attr("x", "10")
                        .attr("y", function(d) { return (d.y + d.height/2 +4); })
                        .attr("font-size", "16");
                }
            }(window.d3));
        },

        addD3LineChart : function(){
            $(".line").children("svg").remove();
            (function (d3) {

                var dataset = GlobalVariable.dataset;
                var linechartPath = GlobalVariable.strbuffer;

                var width = 380;
                var height = 160;

                var svg = d3.select('.line')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                if (dataset !== undefined) {

                    var path = svg.selectAll("path")
                        .data(linechartPath)
                        .enter().append("path")
                        .attr("d", function(d) { return d.points; })
                        .attr("fill", "white")
                        .attr("fill-opacity", "0.2")
                        .attr("stroke", "white")
                        .attr("stroke-width", "1");

                    var circle = svg.selectAll("circle")
                        .data(dataset)
                        .enter().append("circle")
                        .attr("fill", "#6BB9F0")
                        .attr("cx", function(d) { return d.width*30; })
                        .attr("cy", function(d) { return (d.y + (d.height)/2); })
                        .attr("r", "5");

                    var line = svg.selectAll("line")
                        .data(dataset)
                        .enter().append("line")
                        .attr("x1", "0")
                        .attr("y1", function(d) { return (d.y + (d.height)/2); })
                        .attr("x2", function(d) { return d.width*30; })
                        .attr("y2", function(d) { return d.y + (d.height)/2; })
                        .attr("stroke", "#6BB9F0")
                        .attr("stroke-width", "2");

                    var text = svg.selectAll("text")
                        .data(dataset)
                        .enter().append("text")
                        .text(function(d) {return d.value;})
                        .attr("x", "10")
                        .attr("y", function(d) { return (d.y + d.height/2 -4); })
                        .attr("font-size", "16");
                }
            }(window.d3));
        }
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

});



app.controller("inventoryCtrl", function($scope, GlobalVariable){

    $scope.inventory = GlobalVariable.inven;
    $scope.invenLog = [];

    $scope.showItem = $scope.inventory[0];
    $scope.reasonList = [{value : "구입"}, {value : "판매"}];
    $scope.reason = $scope.reasonList[0];

    $scope.path = [{points : ""}];

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
        if( Number.isNaN(quantity) || $scope.itemName === "" || $scope.num === "" || $scope.num <= 0){
            inputError();
            return;
        }

        console.log("input : " + ($scope.reason.value === $scope.reasonList[0].value));
        if($scope.reason.value === $scope.reasonList[0].value) {
            for(var i=0, item; item=$scope.inventory[i]; i++) {
                console.log("already have : "+ (item.name === $scope.itemName));
                if (item.name === $scope.itemName) {
                    console.log("prev : "+item.quantity);
                    item.quantity = item.quantity + quantity;
                    console.log("new : "+item.quantity);

                    $scope.invenLog.push({
                        name: $scope.itemName,
                        input: "+"+quantity,
                        quantity: item.quantity,
                        date: new Date(),
                        reason: $scope.reason.value
                    });

                    $scope.itemName = "";
                    $scope.itemQuantity = "";
                    return;
                }
            }
            $scope.invenLog.push({
                name: $scope.itemName,
                input: "+"+quantity,
                quantity: quantity,
                date: new Date(),
                reason: $scope.reason.value
            });
            GlobalVariable.inven.push({
                name: $scope.itemName,
                quantity: quantity,
                date: new Date(),
                reason: $scope.reason.value
            });

            $scope.itemName = "";
            $scope.itemQuantity = "";
            return;
        };

        console.log("output : " + ($scope.reason.value === $scope.reasonList[1].value));
        if($scope.reason.value === $scope.reasonList[1].value) {
            for(var i=0, item; item=$scope.inventory[i]; i++) {
                console.log("already have : "+ (item.name === $scope.itemName));
                if((item.name === $scope.itemName) && $scope.itemQuantity <= item.quantity) {
                    console.log("prev : "+item.quantity);
                    item.quantity = item.quantity - quantity;
                    console.log("new : "+item.quantity);

                    $scope.invenLog.push({
                        name: $scope.itemName,
                        output: "-"+quantity,
                        quantity : item.quantity,
                        date: new Date(),
                        reason: $scope.reason.value
                    });

                    $scope.itemName = "";
                    $scope.itemQuantity = "";
                    return;
                } else{
                    alert("ERROR::감소할 수 없습니다.");
                    console.log("ERROR::감소할 수 없습니다.");
                    $scope.itemName = "";
                    $scope.itemQuantity = "";
                    return;
                }
            }
            alert("ERROR::0에서 감소할 수 없습니다.");
            console.log("ERROR::0에서 감소할 수 없습니다.");
            $scope.itemName = "";
            $scope.itemQuantity = "";
            return;
        };
    };

    $scope.saveChange = function($event, item){

        item.name = $scope.newItemName;
        item.num = $scope.newItemQuantity;

        var btn = $event.currentTarget;
        var hiddenOpt = $(btn).closest(".modify");

        hiddenOpt.addClass("hidden");
    };

    //$scope.modifyItem = function($event){
    //
    //    var btn = $event.currentTarget;
    //    var hiddenOpt = $(btn).closest(".itemElement").children(".modify");
    //
    //    hiddenOpt.toggleClass("hidden");
    //};

    $scope.deleteItem = function($event){

        var btn = $event.currentTarget;

        for(var i= 0, item; item = GlobalVariable.inven[i]; i++){
            if(item.name === $(btn).closest(".itemElement").children(".itemName").text()){
                GlobalVariable.inven.splice(i, 1);
                console.log("%c아이템 삭제 : " + item.name,"color : red;");
                console.log("%c남은 아이템 목록 : ","color : red;");
                console.log(GlobalVariable.inven);
                return;
            }};
        console.log($event.currentTarget);
    };

    $scope.filterKey = function (item) {

        for(var i = 0, list; list = GlobalVariable.inven[i]; i++){
            if(item.name === list.name){
                return item.name;
            }
        }
    };

    //var makeChartPath = function() {
    //
    //    //line chart의 각 line의 끝 점을 이어주는 path를 생성한다.
    //    $scope.path[0].points = "";
    //
    //    for (var i = 0, item; item = GlobalVariable.inven[i]; i++) {
    //        if (i === 0) {
    //            $scope.path[0].points += "M " + 0 + " ";
    //            $scope.path[0].points += (i * (item.quantity + 5) + (item.quantity) / 2) + " L ";
    //        };
    //
    //        $scope.path[0].points += item.width * 30 + " ";
    //        $scope.path[0].points += (i * (item.quantity + 5) + (item.quantity) / 2) + " ";
    //
    //        if (i === GlobalVariable.inven.length - 1) {
    //            $scope.path[0].points += 0 + " ";
    //            $scope.path[0].points += (i * (item.quantity + 5) + (item.quantity) / 2) + " Z";
    //        };
    //    };
    //};
});