var leaveHistoryModule = angular.module("leaveHistoryModule",[]);

leaveHistoryModule.controller("leaveHistoryController",['$scope',function($scope){

	 $scope.leaveHistory=[
	                      {leaveTag:"holi",applyDate:"12-feb-2015",leaveDate:"12-mar-2015",duration:1,status:"Approved"},
	                      {leaveTag:"Diwali",applyDate:"12-oct-2015",leaveDate:"12-nov-2015",duration:10,status:"Approved"},
	                      {leaveTag:"holi",applyDate:"12-feb-2015",leaveDate:"12-mar-2015",duration:20,status:"Approved"},
	                      {leaveTag:"Diwali",applyDate:"12-oct-2015",leaveDate:"12-nov-2015",duration:5,status:"Approved"},
	                      {leaveTag:"holi",applyDate:"12-feb-2015",leaveDate:"12-mar-2015",duration:10,status:"Approved"},
	                      {leaveTag:"Diwali",applyDate:"12-oct-2015",leaveDate:"12-nov-2015",duration:10,status:"Approved"},
	                      {leaveTag:"holi",applyDate:"12-feb-2015",leaveDate:"12-mar-2015",duration:10,status:"Approved"},
	                      {leaveTag:"Diwali",applyDate:"12-oct-2015",leaveDate:"12-nov-2015",duration:10,status:"Approved"},
	                      {leaveTag:"holi",applyDate:"12-feb-2015",leaveDate:"12-mar-2015",duration:10,status:"Approved"},
	                      {leaveTag:"Diwali",applyDate:"12-oct-2015",leaveDate:"12-nov-2015",duration:10,status:"Approved"}
	                      ];
	 $scope.itemsByPage = 5;
	 $scope.showAlert = function(){alert("sure!!");}
}]);
