'use strict';

var leaveSys = angular.module("leaveSys", ["ui.router",
               'smart-table', 'ngLodash', 'restangular', 'ngCookies'  ]);

leaveSys.config([
         		'$stateProvider',
         		'$urlRouterProvider',
         		'RestangularProvider',
         		function($stateProvider, $urlRouterProvider, RestangularProvider) {
         			$stateProvider.state("Dashboard", {
         				url : "/",
         				templateUrl : "dashboard.html"
         			}).state("employees", {
         				url : "/employees",
         				templateUrl : "employeeList.html",
         				controller : "employeeController" 
         			}).state("approval", {
         				url : "/approval",
         				templateUrl : "approval.html",
         				controller : "approvalController"
         			}).state("leaveHistory", {
         				url : "/leaveHistory",
         				templateUrl : "leavehistory.html",
         				controller : "leaveHistoryController"
         			}).state("profileSetting", {
         				url : "/settings",
         				templateUrl : "profilesetting.html",
         				controller : "profileSettingController"
         			}).state('viewLeave',{
         				url : "/leave",
         				templateUrl : "viewLeave.html",
         				controller : "viewLeaveController",
         				params:{leave:null,fromState:null}
         			});
//         			.state('fullHistory',{
//         				url : "/completeHistory",
//         				templateUrl : "../html/fullHistory.html",
//         				controller : "allHistory"
//         			});
         			
         			$urlRouterProvider.otherwise("/");
         			RestangularProvider
         					.setBaseUrl("http://localhost:8080/leavemanagement/api");

         		} ]);

leaveSys.controller("mainController",['$scope','$cookies', 'Restangular', '$window', 
             function($scope, $cookies, Restangular, $window){
	$scope.user = $cookies.getObject('userInfo').currentUser.firstName;
	$scope.logout = function(){
		Restangular.all("auth/logout").post()
		.then(function(data){
			$window.location.href = "http://localhost:8080/leavemanagement";
			$cookies.remove('userInfo')
		});
		$cookies.remove("userInfo",{path:"/leavemanagement"});
		console.log("called");
	}
}])

leaveSys.controller('employeeController',['$scope', 'Restangular', 'accountStatus',
                   'employeeTypeCode', '$cookies',
                   function($scope, Restangular, accountStatus, employeeTypeCode, $cookies){
	$('#myodal').appendTo("body");
	$('#EditProfile').appendTo("body");
	$('#createProfile').appendTo("body");
	$scope.profileList = {};
	$scope.employeeProfile = {};
	$scope.leaveBalance = {};
	Restangular.one("employee/profiles").get()
			.then(function(data) {
					$scope.rowCollectionProfile = data.plain();
						console.log(data.plain()[0]);
					})
	$scope.viewProfile = function(row) {
		$scope.employeeProfile = row;
		Restangular.one("employee",$scope.employeeProfile.approver1)
		.get().then(function(data) {
			console.log(data.plain());
			if(data != undefined){
				var empInfo = data.plain();
				$scope.approver1 = empInfo.firstName + " " + empInfo.lastName + " [" + empInfo.empCode +"]";
			}
			Restangular.one("employee",$scope.employeeProfile.approver2)
			.get().then(function(data) {
				console.log(data.plain());
				if(data != undefined){
					var empInfo = data.plain();
					$scope.approver2 = empInfo.firstName + " " + empInfo.lastName + " [" + empInfo.empCode +"]";
				}
				});
			Restangular.one("employee",$scope.employeeProfile.approver3)
			.get().then(function(data) {
				console.log(data.plain());
				if(data != undefined){
					var empInfo = data.plain();
					$scope.approver3 = empInfo.firstName + " " + empInfo.lastName + " [" + empInfo.empCode +"]";
				}
				});
			});
		
		
	}
	$scope.editProfile = function(row) {
		$scope.accountType = accountStatus.getaccountStatusList();
		$scope.employeeType = employeeTypeCode.getEmployeeTypeList();
		$scope.employeeProfile = row;	
		console.log($scope.employeeProfile);
		Restangular.one("employee",$scope.employeeProfile.empId).one("leave").one("balance")
		.get().then(function(data) {
			console.log(data);
			if(data == undefined)
				$scope.leaveBalance = {};
			else{
				console.log(data.plain());
				$scope.leaveBalance = data.plain();
			}
		});
	};
	$scope.submitEdit = function(){
		var empId = $cookies.getObject('userInfo').currentUser.empId;
		console.log($scope.employeeProfile);
		
		delete $scope.employeeProfile.isSelected;
		$scope.leaveBalance.empId = $scope.employeeProfile.empId;
		$scope.employee = {"employeeProfile":$scope.employeeProfile,"leaveBalance":$scope.leaveBalance};
		console.log($scope.employee);
		Restangular.all("employee/profile/" + empId)
		.customPUT($scope.employee).then(function(data){
			console.log(data);
			$("#EditProfile").modal('hide');
		})
	};
	$scope.createProfile = function(){
		$scope.employeeInfo = {};
	}
	
	$scope.submitEmp = function(){
		console.log($scope.employeeInfo);
		Restangular.all("employee").post($scope.employeeInfo).then(
				function(data) {
					var res = data.plain();
					if (Number(res.empId) == 0) {
						alert("user not registered");
					} else {
						alert("Success! wait for Approval..");
						
					}
					console.log(data.plain());
					console.log("id is : " + res.empId);
					$("#createProfile").modal('hide');
				})
	}
	
	$scope.fatchfatchData = function fatchData(tableState){
		console.log("hi");
	}
}])

leaveSys.controller('approvalController',['$scope', '$cookies', '$window','Restangular',
			function($scope, $cookies, $window, Restangular) {
				$scope.leaveApproval = {};
				$scope.noData = false;
				$scope.rowCollectionApproval = [];
				if (($cookies.getObject('userInfo') == undefined)) {
					$window.location.href = 'http://localhost:8080/leavemanagement';
				} else {
					var empId = $cookies.getObject('userInfo').currentUser.empId;
					Restangular.one("employee/" + empId + "/leave/approval")
					.get().then(function(data) {
						console.log(data.length);
						if(data.length == 0)
							$scope.noData = false;
						else{
							$scope.noData = true;
							$scope.leaveApproval = {};
							$scope.rowCollectionApproval = data.plain();
							if($cookies.getObject('userInfo').currentUser.employeeType == '964'){
								console.log("executing availed block");
								Restangular.one("employee/" + empId + "/leave/approved")
								.get().then(function(response) {
									for (var i=0; i<response.length; i++){
										console.log(response.plain()[i]);
									    $scope.rowCollectionApproval.push(response.plain()[i]);
									    console.log($scope.rowCollectionApproval);
									}
														
								})
							}
						}	
					})
				}
				
			$scope.avilLeaveRequest = function(){
				var leaveBalance = {};
				$scope.employeeLeaveBalance.leaveHistory.leaveStatusCode = 998;
				$scope.employeeLeaveBalance.leaveBalance = $scope.leaveBalance; 
				console.log($scope.employeeLeaveBalance);
				Restangular.all("employee/" + empId + "/leave/avail")
				.customPUT($scope.employeeLeaveBalance)
				.then(function(data) {
					console.log(data.plain());
					$("#UpdateBalance").modal('hide');
				});
			}
							
			$scope.notAvail = function(row){
				$scope.leaveBalance = {};
				$scope.employeeLeaveBalance = row;
				$scope.leaveBalance = {empId: $scope.employeeLeaveBalance.employeeProfile.empId};
				$scope.employeeLeaveBalance.leaveHistory.leaveStatusCode = 999;
				$scope.employeeLeaveBalance.leaveBalance = $scope.leaveBalance;
				console.log($scope.employeeLeaveBalance);
				Restangular.all("employee/" + empId + "/leave/avail")
				.customPUT($scope.employeeLeaveBalance)
				.then(function(data) {
					console.log(data.plain());
					alert("Record Updated");
				});
			}
							
			$scope.updateStatus = function(row,leaveStatus){
				$scope.leaveStatus = {};
			    $scope.leaveStatus.leaveId = row.leaveHistory.leaveId;
				$scope.leaveStatus.leaveStatusCode = leaveStatus;
				console.log("hello " + row.leaveHistory.leaveId);
				Restangular.all("employee/" + empId + "/leave")
				.customPUT($scope.leaveStatus)
				.then(function(data) {
					console.log(data.plain());
					var index = $scope.leaveApproval.indexOf(row);
				    if (index !== -1) {
				       $scope.leaveApproval.splice(index, 1);
				       alert("Operation succesfull")
				    }
				});
			}
		} ]);

leaveSys.controller('leaveHistoryController',['$scope','Restangular','$cookies','$window',
                 function($scope, Restangular, $cookies, $windows){
				if (($cookies.getObject('userInfo') == undefined)) {
					$window.location.href = 'http://localhost:8080/leavemanagement';
				} else {
					$scope.fullHistory = {};
					Restangular.one("employee",$cookies.getObject('userInfo').currentUser.empId).one("leave/all")
					.get().then(function(data) {
						if(data == undefined)
							$scope.leaveBalance = {};
						else{
								//console.log(data.plain());
								$scope.rowCollectionHistory = data.plain();
							}
						});
				}
				
				$scope.viewLeaveDetail = function(row){
					$('#viewLeave').appendTo("body");
					console.log(row);
					$scope.employeeProfile = row.employeeProfile;
					$scope.employeeInfo = row.employeeInfo;
					$scope.leave = row.leave;
					$scope.leaveHistory = row.leaveHistory;
				}
}]);

leaveSys.controller('profileSettingController',['$scope', '$cookies', '$window', 'Restangular',
                                    function($scope, $cookies, $window, Restangular){

            	$scope.employeeProfile = $cookies.getObject('userInfo').currentUser;

            	$scope.updatePassword = function(){
            		if($scope.newPassword == $scope.password){
            			$scope.loginCredential = {"user":$scope.employeeProfile.loginId,
            									  "pass":$scope.currentPassword
            									  };
            			$scope.employeeProfile.loginId = $scope.password;
            			
            			var employee = {"employeeProfile":$scope.employeeProfile,
            							"loginCredential":$scope.loginCredential};
            			console.log(employee);
            			
            			Restangular.all("employee/update")
            			.customPUT(employee).then(function(data) {
            							console.log(data.plain());
            							$scope.password = "";
            							$scope.newPassword = "";
            							$scope.currentPassword = "";
            						});
            		} else{
            			alert("new password not matched!!")
            			console.log("not matched");
            		}
            		
            	}
            }])

leaveSys.controller('viewLeaveController',['$scope', '$state', '$stateParams',
                   'Restangular', function($scope, $state, $stateParams, Restangular){
	
	var param = $stateParams.leave;
	$scope.fromState = $stateParams.fromState;
	$scope.employeeProfile = {};
	if(param != undefined && $scope.fromState != undefined){
		$scope.employeeInfo = param.employeeInfo;
		$scope.employeeProfile = param.employeeProfile;
		$scope.leave = param.leave;
		$scope.leaveHistory = param.leaveHistory;
		console.log($stateParams.leave);
		console.log("Hello");
	} else{
		$state.go('Dashboard');
	}
	
	$scope.viewProfileBalance = function(){
		$scope.employeeLeaveBalance = {};
		$('#UpdateBalance').appendTo("body");
		Restangular.one("employee",$scope.employeeProfile.empId).one("leave").one("balance")
		.get().then(function(data) {
			if(data == undefined)
				$scope.leaveBalance = {};
			else{
				console.log(data.plain());
				$scope.leaveBalance = data.plain();
				$scope.cl = $scope.leaveBalance.casualLeave;
				$scope.pl = $scope.leaveBalance.privilegeLeave;
				$scope.sl = $scope.leaveBalance.sickLeave;
				$scope.compoff = $scope.leaveBalance.compOff;
			}
		});	
	}
	
	$scope.showClose = function(code){
		var flag = false;
		if(code >= 995)
			flag = true;
		return flag;
	}
	
	$scope.showReject = function(code){
		var flag = false;
		if(code < 994)
			flag = true;
		return flag;
	}
}])

leaveSys.run(function ($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});

leaveSys.service('accountStatus', function() {
  var accountStatusList = {"Active" : 901,
		  					"Not Approved": 904}

  function getaccountStatusList(){
      return accountStatusList;
  };
  
  return {
	  getaccountStatusList: getaccountStatusList
  };

});

leaveSys.service('employeeTypeCode',function(){
	var employeeTypeList = {"Leavel1" : 961,
						"Team Lead" : 962,
						"Project Manager": 963}
	
	function getEmployeeTypeList(){
		return employeeTypeList;
	}
	
	return {
		getEmployeeTypeList : getEmployeeTypeList
	}
})

leaveSys.filter('leaveStatus', function() {
	return function(leaveStatusCode) {
		switch(leaveStatusCode){
			case 1000:
				return  "Canceled";
			case 991:
				return "In-Progress";
			case 992:
				return "Lead Approved";
			case 993:
				return "manager Approved";
			case 994:
				return "Approved";
			case 995:
				return "Lead Rejected";
			case 996:
				return "Manager Rejected";
			case 997:
				return "HR Rejected";
			case 998:
				return "Availed";
			case 999:
				return "Not Availed";
		}
	}
})

leaveSys.filter('AccountStatus',function(){
	return function(code){
		if(code == "901")
			return "Active";
		else if(code == "904")
			return "Not Approved";
		else return code;
	}
});
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
leaveSys.filter('EmployeeType',function(){
	return function(code){
		if(code == "961")
			return "Level1";
		else if(code == "962" || code == "963"){
			return "Approver";
		} else if(code == "964")
			return "HR";
	}
})
leaveSys.filter('leaveType', function(){
	return function(leaveTypeCode){
		switch(leaveTypeCode){
			case 921:
				return "Casual Leave";
			case 922:
				return "Privilege Leave";
			case 923:
				return "Sick Leave";
			case 924:
				return "Comp Off";
			default:
				return leaveTypeCode;
		}
	}
})