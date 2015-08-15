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
