var leaveModule = angular.module("leaveModule", []);

leaveModule.controller("leaveHistoryController",[
						'$scope',
						'Restangular',
						'$cookies',
						'$window',
						function($scope, Restangular, $cookies, $window) {

							if (($cookies.getObject('userInfo') == undefined)) {
								$window.location.href = 'http://localhost:8080/leavemanagement';
							} else {
								var empId = $cookies.getObject('userInfo').currentUser.empId;
								Restangular.one("employee/" + empId + "/leave")
									.get().then(
										function(data) {
											$scope.leaveHistory = {};
											$scope.rowCollection = data.plain();
											console.log(data.plain());
										});
								$scope.itemsByPage = 5;
							}

							$scope.cancelLeave = function(leaveId) {
								var empId = $cookies.getObject('userInfo').currentUser.empId;
								$scope.leaveInstance = {};
								$scope.leaveInstance.leaveId = leaveId;
								$scope.leaveInstance.leaveStatusCode = 1000;
								Restangular.all("employee/" + empId + "/leave")
									.customPUT($scope.leaveInstance).then(function(data) {
													console.log(data.plain());
												});
							}

							$scope.CanBeCancled = function(leaveStatusCode) {
								if (leaveStatusCode == 1000 || leaveStatusCode == 998 || leaveStatusCode == 999)
									return true;
								return false;
							}
						} ]);

leaveModule.controller('newLeaveController',[
						'$scope',
						'$cookies',
						'$window',
						'$filter',
						'Restangular',
						function($scope, $cookies, $window, $filter,Restangular) {
							if (($cookies.getObject('userInfo') == undefined)) {
								$window.location.href = 'http://localhost:8080/leavemanagement';
							} else {
								$scope.leave = {};
								$scope.applyLeave = function() {
									$scope.leave.startdate = $filter('date')($scope.startDate, "yyyy-MM-dd");
									$scope.leave.endDate = $filter('date')($scope.endDate, "yyyy-MM-dd");
									$scope.leave.empId = $cookies.getObject('userInfo').currentUser.empId;
									$scope.leave.projectId = $cookies.getObject('userInfo').currentUser.projectId;
									Restangular.all('employee/' + $scope.leave.empId+ '/leave')
										.post($scope.leave).then(function(data) {
											$scope.reset();
											console.log(data.plain());
											alert("Submitted... :)");
										});
									}
							}

							$scope.reset = function() {
								$scope.leave = {};
								var original = $scope.leave;
								$scope.leave = angular.copy(original);
								$scope.leaveForm.$setPristine();
							}
						} ])

leaveModule.controller('leaveApproval',['$scope', '$cookies', '$window','Restangular',
						function($scope, $cookies, $window, Restangular) {
							$scope.leaveApproval = {};
							$scope.rowCollectionApproval = [];
							if (($cookies.getObject('userInfo') == undefined)) {
								$window.location.href = 'http://localhost:8080/leavemanagement';
							} else {
								var empId = $cookies.getObject('userInfo').currentUser.empId;
								Restangular.one("employee/" + empId + "/leave/approval")
										.get().then(function(data) {
											$scope.leaveApproval = {};
											$scope.rowCollectionApproval = data.plain();
											if($cookies.getObject('userInfo').currentUser.employeeType == '964'){
												console.log("executing availed block");
												Restangular.one("employee/" + empId + "/leave/approved")
												.get().then(function(response) {
													//$scope.leaveApproval = {};
													for (var i=0; i<response.length; i++){
														console.log(response.plain()[i]);
													    $scope.rowCollectionApproval.push(response.plain()[i]);
													    console.log($scope.rowCollectionApproval);
													}
													
												})
											}
											console.log(data);
										})
										
							}
							
							$scope.viewProfileBalance = function(row){
								$scope.employeeLeaveBalance = {};
								$('#UpdateBalance').appendTo("body");
								$scope.employeeLeaveBalance = row;
								
								Restangular.one("employee",row.employeeProfile.empId).one("leave").one("balance")
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
							
							$scope.avilLeaveRequest = function(){
								var leaveBalance = {};
								
								$scope.employeeLeaveBalance.leaveHistory.leaveStatusCode = 998;
								$scope.employeeLeaveBalance.leaveBalance = $scope.leaveBalance; 
								console.log($scope.employeeLeaveBalance);
								Restangular.all("employee/" + empId + "/leave/avail")
								.customPUT($scope.employeeLeaveBalance).then(function(data) {
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
								.customPUT($scope.employeeLeaveBalance).then(function(data) {
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
								.customPUT($scope.leaveStatus).then(function(data) {
												console.log(data.plain());
												var index = $scope.leaveApproval.indexOf(row);
										        if (index !== -1) {
										            $scope.leaveApproval.splice(index, 1);
										            alert("Operation succesfull")
										        }
											});
								
							}
						} ]);

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

leaveSys.filter('ActionType',function(){
	return function(leaveStatusCode){
		if(leaveStatusCode == 994)
			return true;
		return false;
	}
})