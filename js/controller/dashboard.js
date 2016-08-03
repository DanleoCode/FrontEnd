'use strict';
var dashBoardModule = angular.module("dashBoardModule", [ 'ngCookies' ]);

dashBoardModule.controller('dashBoardController', [ '$scope', 'Restangular',
		'$cookies', '$window', function($scope, Restangular, $cookies, $window) {
			$scope.employeeProfile = {};
			if (($cookies.getObject('userInfo') == undefined)) {
				$window.location.href = 'http://localhost:8080/leavemanagement';
			}
			else{
				console.log($cookies.getObject('userInfo').currentUser);
				$scope.employeeProfile.empCode = $cookies.getObject('userInfo').currentUser.empCode;
				$scope.employeeProfile.firstName = $cookies.getObject('userInfo').currentUser.firstName;
				$scope.employeeProfile.lastName = $cookies.getObject('userInfo').currentUser.lastName;
				
				//console.log($cookies.getObject('userInfo').currentUser);
				console.log($cookies.getObject('userInfo').currentUser.empId);
				var empId = $cookies.getObject('userInfo').currentUser.empId;
				Restangular.one("employee",empId).one("leave").one("balance")
					.get().then(function(data){
						var leaveBalance = data.plain(); 
						$scope.employeeProfile.cl = leaveBalance.casualLeave;
						$scope.employeeProfile.sl = leaveBalance.sickLeave;
						$scope.employeeProfile.pl = leaveBalance.privilegeLeave;
						$scope.employeeProfile.compOff = leaveBalance.compOff;
						$scope.employeeProfile.total = $scope.employeeProfile.cl + $scope.employeeProfile.sl + $scope.employeeProfile.pl;
						console.log(data.plain());
				})
			}
		} ]);