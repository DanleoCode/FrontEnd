'use strict';

var leaveSys = angular.module("leaveSys", [ "leaveHistoryModule","ui.router",'smart-table' ]);

leaveSys.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
	$stateProvider.state("employeeDashboard", {
						url:"/home",
						templateUrl: "view/html/employeeDashboard.html"
					})
					.state("applyLeave",{
						url:"/applyleave",
						templateUrl:"view/html/applyleave.html"
					})
					.state("leaveHistory",{
						url:"/applyhistory",
						templateUrl:"view/html/leavehistory.html",
						controller:"leaveHistoryController"
					})
					.state("approveLeave",{
						url:"/approveleave",
						templateUrl:"view/html/approveleave.html"
					})
					.state("employeeSetting",{
						url:"/employeesetting",
						templateUrl:"view/html/employeesetting.html"
					});
	
	$urlRouterProvider.otherwise("/home");
}])
