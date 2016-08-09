var settingModule = angular.module('settingModule',[]);

settingModule.controller('setting',['$scope', '$cookies', '$window', 'Restangular',
                        function($scope, $cookies, $window, Restangular){
//	alert("hi");
	
	$scope.employeeProfile = $cookies.getObject('userInfo').currentUser;
	console.log($scope.employeeProfile);
	$scope.saythename = function(num){
		
	}
	
	$scope.updatePassword = function(){
		console.log($scope.employeeProfile);
	}
}])