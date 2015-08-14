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
        GlobalVariable.employeeList.push(
            { name : $scope.employeeName, time : $scope.workingTime, pay : GlobalVariable.hourly_pay * $scope.workingTime }
        );
        $scope.employeeName = "";
        $scope.workingTime = "";
    };
});

app.controller("ScheduleTableCtrl", function($scope) {

    $scope.scheculer = [
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""},
        {mon : "", tue : "", wed : "", thu : "", fri : "", sat : "", sun : ""}
    ];
});