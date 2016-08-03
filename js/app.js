'use strict';

var leaveSys = angular.module("leaveSys", [ "leaveHistoryModule", "ui.router", 'dashBoardModule',
		'smart-table', 'ngLodash', 'restangular', 'ngCookies']);

leaveSys.config([ '$stateProvider', '$urlRouterProvider', 'RestangularProvider',
		function($stateProvider, $urlRouterProvider, RestangularProvider) {
			$stateProvider.state("employeeDashboard", {
				url : "/home",
				templateUrl : "../html/employeeDashboard.html",
				controller : "dashBoardController"
			}).state("applyLeave", {
				url : "/applyleave",
				templateUrl : "../html/applyleave.html"
			}).state("leaveHistory", {
				url : "/applyhistory",
				templateUrl : "../html/leavehistory.html",
				controller : "leaveHistoryController"
			}).state("approveLeave", {
				url : "/approveleave",
				templateUrl : "../html/approveleave.html"
			}).state("employeeSetting", {
				url : "/employeesetting",
				templateUrl : "../html/employeesetting.html"
			});
			
			$urlRouterProvider.otherwise("/home");
			RestangularProvider.setBaseUrl("http://localhost:8080/leavemanagement/api");
			
		} ])
