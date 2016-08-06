var admin = angular.module('adminModule',[]);

admin.controller("listProfile",['$scope', 'Restangular',function($scope,Restangular){
	$scope.profileList= {};
	Restangular.one("employee/profiles").get()
	.then(function(data){
		$scope.rowCollectionProfile = data.plain(); 
		console.log(data.plain()[0]);
	})
	
	$scope.viewProfile = function(row){
		console.log(row);
	}
	
	$scope.User = "Admin";
}])

admin.filter('AcoountStatus',function(){
	return function(code){
		if(code == 901)
			return "Active";
		else if(code == 904)
			return "Not Approved";
		else 
			return code;
	}
})