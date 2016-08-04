'use strict';

var leaveSys = angular.module("leaveSys", [ "leaveModule", "ui.router",
		'dashBoardModule', 'smart-table', 'ngLodash', 'restangular',
		'ngCookies' ]);

leaveSys.config([
		'$stateProvider',
		'$urlRouterProvider',
		'RestangularProvider',
		function($stateProvider, $urlRouterProvider, RestangularProvider) {
			$stateProvider.state("employeeDashboard", {
				url : "/home",
				templateUrl : "../html/employeeDashboard.html",
				controller : "dashBoardController"
			}).state("applyLeave", {
				url : "/applyleave",
				templateUrl : "../html/applyleave.html",
				controller : "newLeaveController" 
			}).state("leaveHistory", {
				url : "/applyhistory",
				templateUrl : "../html/leavehistory.html",
				controller : "leaveHistoryController"
			}).state("approveLeave", {
				url : "/approveleave",
				templateUrl : "../html/approveleave.html",
				controller : "leaveApproval"
			}).state("employeeSetting", {
				url : "/employeesetting",
				templateUrl : "../html/employeesetting.html"
			});

			$urlRouterProvider.otherwise("/home");
			RestangularProvider
					.setBaseUrl("http://localhost:8080/leavemanagement/api");

		} ]);
	
leaveSys.controller('mainController',['$scope','Restangular','$window', '$cookies',function($scope, Restangular, $window, $cookies){
	$scope.logout = function(){
		Restangular.all("auth/logout").post()
		.then(function(data){
			$window.location.href = "http://localhost:8080/leavemanagement";
			$cookies.remove('userInfo')
		});
		$cookies.remove("userInfo",{path:"/leavemanagement"});
		console.log("called");
	}
	
	$scope.approvalTab = function(){
		var employeeType = $cookies.getObject('userInfo').currentUser.employeeType;
		if(employeeType == "961")
			return false;
		return true;
	}
}]);

