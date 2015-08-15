var schedulerApp = angular.module("main", ['daypilot']);

schedulerApp.controller('DemoCtrl', function($scope, $timeout, $http) {
    $scope.events = [];

    $scope.dayConfig = {
        viewType: "Day"
    };

    $scope.weekConfig = {
        visible: false,
        viewType: "Week"
    };

});


var app = angular.module("mySchedulerApp", []);

app.factory('GlobalVariable', function() {
    return {
        hourly_pay : 6000,
        employeeList : []
    };
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

app.controller("ScheduleTableCtrl", function($scope) {

    $scope.scheculer = [
        {time : "07:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "08:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "09:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "10:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "11:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "12:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "13:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "14:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "15:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "16:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "17:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "18:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "19:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "20:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "21:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {time : "22:00", mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""}
    ];
});