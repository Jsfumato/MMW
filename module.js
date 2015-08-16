var app = angular.module("mySchedulerApp", ["daypilot"]);

app.factory('GlobalVariable', function() {
    return {
        hourly_pay : 6000,
        employeeList : [],
        indexArray : []
    };
});

app.controller("ScheduleTableCtrl", function($scope, GlobalVariable) {

    $scope.indexArray = GlobalVariable.indexArray;

    $scope.rows = [
        {time: "06:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "07:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "08:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "09:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "10:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "11:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "12:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "13:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "14:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "15:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "16:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "17:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "18:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "19:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "20:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "21:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "22:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "23:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time: "24:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
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
        //for(var i=0; GlobalVariable.employeeList.length; i++) {
        //    if (GlobalVariable.employeeList[i].name === $scope.employeeName) {
        //        GlobalVariable.employeeList[i].time = GlobalVariable.employeeList[i].time + $scope.indexArray.length,
        //        GlobalVariable.employeeList[i].pay = GlobalVariable.employeeList[i].pay + GlobalVariable.hourly_pay*$scope.indexArray.length
        //
        //        GlobalVariable.indexArray = [];
        //        $scope.indexArray = GlobalVariable.indexArray;
        //        console.log($scope.indexArray);
        //        $scope.employeeName = "";
        //        return;
        //    }
        //}
        //

        console.log($scope.indexArray.length);

        GlobalVariable.employeeList.push({
            name: $scope.employeeName,
            time: $scope.indexArray.length,
            pay: GlobalVariable.hourly_pay * $scope.indexArray.length
        });

        GlobalVariable.indexArray = [];
        $scope.indexArray = GlobalVariable.indexArray;
        console.log($scope.indexArray);
        $scope.employeeName = "";
    };

    $scope.openPopUp = function() {
        $scope.ishidden = false;
        console.log($scope.ishidden);
    };

    $scope.isHidden = function () {
        return $scope.ishidden;
    }


    //
    //$scope.weekConfig = {
    //    visible: true,
    //    viewType: "Week"
    //};
    //
    //$scope.eventList = [];
    //for(var i=0; i<$scope.events.length; i++){
    //    $scope.eventList.push({ name : $scope.events[i].name });
    //}
    //
    ////Example

    //$scope.moveEvent = function() {
    //    var event = $scope.events[0];
    //    event.start = event.start.addDays(1);
    //    event.end = event.end.addDays(1);
    //};
    //
    //$scope.renameEvent = function() {
    //    for(var i=0; i<$scope.events.length; i++){
    //        //if($scope.events[i].text === $scope.renameTarget){
    //        //    $scope.events[i].text = $scope.newEventName;
    //        //}
    //        console.log($scope.events[i].name);
    //        console.log($scope.renameTarget);
    //        console.log($scope.newEventName);
    //    }
    //    $scope.renameTarget = "";
    //    $scope.newEventName = "";
    //};

});

app.controller("EmployeeListCtrl", function($scope, GlobalVariable) {

    $scope.employees = GlobalVariable.employeeList;

    $scope.add = function() {
        if($scope.employeeName !== "" && $scope.workingTime !== "") {
            GlobalVariable.employeeList.push({
                name: $scope.employeeName,
                time: $scope.workingTime,
                pay: GlobalVariable.hourly_pay * $scope.workingTime
            });
            $scope.employeeName = "";
            $scope.workingTime = "";
        }
        else
            alert("빈칸을 채워주세요");
    };

    $scope.addIfEnter = function($event){
        var keyCode = $event.which || $event.keyCode;
        if (keyCode === 13) {
            this.add();
        }
    };
});
