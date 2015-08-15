var app = angular.module("mySchedulerApp", ["daypilot"]);

app.factory('GlobalVariable', function() {
    return {
        hourly_pay : 6000,
        employeeList : [],
        events : [{
            start: new DayPilot.Date("2015-08-16T10:00:00"),
            end: new DayPilot.Date("2015-08-16T14:00:00"),
            id: DayPilot.guid(),
            text: "First Event"
        }]
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

app.controller("ScheduleTableCtrl", function($scope, GlobalVariable, $timeout, $http) {

    $scope.events = GlobalVariable.events;

    $scope.weekConfig = {
        visible: true,
        viewType: "Week"
    };

    //Example
    $scope.addEvent = function() {
        alert($scope.startTime);
        $scope.events.push(
            {
                start: new DayPilot.Date($scope.startTime),
                end: new DayPilot.Date("2015-08-20T12:00:00"),
                id: DayPilot.guid(),
                text: "Simple Event"
            }
        );
    };
    $scope.moveEvent = function() {
        var event = $scope.events[0];
        event.start = event.start.addDays(1);
        event.end = event.end.addDays(1);
    };

    $scope.renameEvent = function() {

        for(var i=0; i<$scope.events.length; i++){
            if($scope.events[i].text === $scope.renameTarget){
                $scope.events[i].text = $scope.newEventName;
            }
        }
        $scope.renameTarget = "";
        $scope.newEventName = "";
    };

});