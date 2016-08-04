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
								if (leaveStatusCode == 1000)
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
									Restangular.all('employee/' + $scope.leave.empId+ '/leave')
										.post($scope.leave).then(function(data) {
											$scope.reset();
											console.log(data.plain());
											alert("Sbmitted... :)");
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

leaveModule.controller('leaveApproval',[
						'$scope',
						'$cookies',
						'$window',
						'Restangular',
						function($scope, $cookies, $window, Restangular) {
							$scope.leaveApproval = {};
							if (($cookies.getObject('userInfo') == undefined)) {
								$window.location.href = 'http://localhost:8080/leavemanagement';
							} else {
								var empId = $cookies.getObject('userInfo').currentUser.empId;
								Restangular.one("employee/" + empId + "/leave/approval")
										.get().then(function(data) {
											$scope.leaveApproval = {};
											$scope.rowCollectionApproval = data.plain()[0];
											console.log();
										})
							}
						} ]);

leaveModule.filter('leaveStatus', function() {
	return function(leaveStatusCode) {
		if (leaveStatusCode == 1000)
			return "Canceled";
		else if (leaveStatusCode == 991)
			return "In-Progress";
	}
})