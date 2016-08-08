'use strict';

var leaveSys = angular.module("leaveSys", [ "leaveModule", "ui.router",
		'dashBoardModule', 'smart-table', 'ngLodash', 'restangular',
		'ngCookies', 'adminModule' ]);

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
			}).state('Profiles',{
				url : "/profiles",
				templateUrl : "../html/profileList.html",
				controller : "listProfile"
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
	$scope.profileTab = function(){
		var employeeType = $cookies.getObject('userInfo').currentUser.employeeType;
		if(employeeType == "964")
			return true;
		return false;
	}
}]);

leaveSys.filter('AccountStatus',function(){
	return function(code){
		if(code == "901")
			return "Active";
		else if(code == "904")
			return "Not Approved";
		else return code;
	}
});

leaveSys.filter('EmployeeType',function(){
	return function(code){
		if(code == "961")
			return "Level1";
		else if(code == "962"){
			return "Approver";
		} else if(code == "964")
			return "HR";
	}
})
leaveSys.filter('gender',function(){
	return function(code){
		if(code == true)
			return "Male";
		else if(code == false)
			return "Female";
		else 
			return code; 
	}
})

leaveSys.service('accountStatus', function() {
  var accountStatusList = {"Active" : 901,
		  					"Not Approved": 904}
//	  [{id:901,label:"Active"},
//       {id:904, label:"Not Approved"}];

  function getaccountStatusList(){
      return accountStatusList;
  };

  return {
	  getaccountStatusList: getaccountStatusList
  };

});

