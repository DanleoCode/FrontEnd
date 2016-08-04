'use strict';

var startApp = angular.module("startApp", [ 'ngLodash', 'restangular',
		'ui.router', 'ngCookies' ]);

startApp.config([
		'$stateProvider',
		'$urlRouterProvider',
		'RestangularProvider',
		function($stateProvider, $urlRouterProvider, RestangularProvider) {
			$stateProvider.state('login', {
				url : "/login",
				templateUrl : "view/html/login.html",
				controller : "loginController"
			}).state('registration', {
				url : "/register",
				templateUrl : "view/html/newregistration.html",
				controller : "RegistrationController"
			});
			$urlRouterProvider.otherwise("/login");
			RestangularProvider.setBaseUrl('http://localhost:8080/leavemanagement/api');
		} ])

startApp.controller("loginController",[
					'$scope',
					'Restangular',
					'$window',
					'$cookies',
					'$cookieStore',
						function($scope, Restangular, $window, $cookies,
								$cookieStore) {
							if ($cookies.getObject("userInfo") == undefined) {
								$scope.loginCredential = {};
								$scope.userInfo = {};
								$scope.loginCredential.user = "AL185";
								$scope.loginCredential.pass = "";
								$scope.changePage = function() {
									console.log($scope.loginCredential);
									Restangular.all("auth/login")
											.post($scope.loginCredential)
											.then(function(data) {
													$scope.userInfo = data.plain();
													if (Number($scope.userInfo.empId) > 0) {
														var obj = {currentUser : $scope.userInfo};
														$cookies.putObject('userInfo',obj);
														var cookie = $cookies.getObject('userInfo')
														console.log(cookie.currentUser);
														$window.location.href = 'view/html/index.html';
													} else {
														alert("Not Authorized");
													}
												});
									}
							} else{
								$window.location.href = 'view/html/index.html'
							}
						} ]);

startApp.controller('RegistrationController', [
		'$scope',
		'Restangular',
		function($scope, Restangular) {
			$scope.employeeInfo = {};

			$scope.createNewUser = function() {

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
						})

				console.log($scope.employeeInfo);
			}
		} ])