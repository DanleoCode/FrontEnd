var admin = angular.module('adminModule', []);

admin.controller("listProfile", [
						'$scope',
						'Restangular',
						'accountStatus',
						'$cookies',
						'$window',
						'employeeTypeCode',
						function($scope, Restangular, accountStatus,$cookies,$window,employeeTypeCode) {
							if (($cookies.getObject('userInfo') == undefined)) {
								$window.location.href = 'http://localhost:8080/leavemanagement';
							} else {
								
								$('#myodal').appendTo("body");
								$('#EditProfile').appendTo("body");
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

								}
								$scope.editProfile = function(row) {
									$scope.accountType = accountStatus.getaccountStatusList();
									$scope.employeeType = employeeTypeCode.getEmployeeTypeList();
									$scope.employeeProfile = row;	
									console.log($scope.employeeProfile);
									Restangular.one("employee",$scope.employeeProfile.empId).one("leave").one("balance")
									.get().then(function(data) {
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
							}
						} ])

admin.controller('allHistory',['$scope','Restangular','$cookies','$window',
                 function($scope, Restangular, $cookies, $windows){
				if (($cookies.getObject('userInfo') == undefined)) {
					$window.location.href = 'http://localhost:8080/leavemanagement';
				} else {
					$scope.fullHistory = {};
					console.log("heloo");
					Restangular.one("employee",$cookies.getObject('userInfo').currentUser.empId).one("leave/all")
					.get().then(function(data) {
						if(data == undefined)
							$scope.leaveBalance = {};
						else{
								console.log(data.plain());
								$scope.rowCollectionHistory = data.plain();
							}
						});
				}
				
				$scope.viewLeaveDetail = function(row){
					$('#viewLeave').appendTo("body");
					console.log(row.employeeProfile);
					$scope.employeeProfile = row.employeeProfile;
					$scope.employeeInfo = row.employeeInfo;
					$scope.leave = row.leave;
					$scope.leaveHistory = row.leaveHistory;
				}
}]);
admin.filter('AcocountStatus', function() {
	return function(code) {
		if (code == 901)
			return "Active";
		else if (code == 904)
			return "Not Approved";
		else
			return code;
	}
})
