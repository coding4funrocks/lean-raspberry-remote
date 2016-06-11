// Define the `raspberryRemoteApp` module
var raspberryRemoteApp = angular.module('raspberryRemoteApp', ['ngRoute', 'frapontillo.bootstrap-switch']);

// Configure our routes
raspberryRemoteApp.config(function ($routeProvider) {
    $routeProvider

            // route for the home page
            .when('/', {
        templateUrl : 'pages/home.html',
        controller  : 'mainController'
    })

            // route for the devices page
            .when('/devices', {
        templateUrl : 'pages/devices.html',
        controller  : 'devicesListController'
    })

            // route for the admin page
            .when('/admin', {
        templateUrl : 'pages/admin.html',
        controller  : 'addDeviceFormController'
    });
});

// create the controller and inject Angular's $scope
raspberryRemoteApp.controller('mainController', function ($scope) {
    
    // create a message to display in our view
    $scope.message = 'Hello World!';
});


// Define the `devicesListController` controller on the `raspberryRemoteApp` module
raspberryRemoteApp.controller('devicesListController', function ($scope, $http) {
    
    $scope.removeRow = function (device) {
        $http.delete('http://localhost:1337/api/devices/' + device.id, device).
            success(function (data) {
            console.log(data);
            $scope.devices = data;
        });
    };
    
    $scope.toggle = function (device) {        
        $scope.switchStatus = '';
        $http.put('http://localhost:1337/api/devices/' + device.id + '/' + device.state, null)
            .success(function (data) {
            $scope.devices = data;
         })
            .error(function (data) {
            $scope.devices = data;
            $scope.switchStatus = 'Something went wrong!';
        });
    };

    $http.get('http://localhost:1337/api/devices').
        success(
        function (data) {
            $scope.devices = data;
        })

});

// Define the `addDeviceFormController` controller on the `raspberryRemoteApp` module
raspberryRemoteApp.controller('addDeviceFormController', function ($scope, $http, $location) {
    $scope.master = {};
    $scope.addFormStatus = '';

    $scope.update = function (device) {
        console.log(device);
        
        $http.post('http://localhost:1337/api/devices', device)
            .success(function () {
            $scope.device = angular.copy($scope.master);
            $location.path('/devices');
        })
            .error(function () {
            $scope.addFormStatus = 'Something went wrong!';
        });
    };

    $scope.reset = function () {
        $scope.device = angular.copy($scope.master);
        $scope.addFormStatus = '';
    };
    
    $scope.reset();
})