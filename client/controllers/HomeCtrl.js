/* global moment */
/* global angular */
'use strict';

var controllers = controllers || angular.module('GifProject.controllers', []);

controllers.controller('HomeController', ['$scope', 'ReverseService',
	function($scope, ReverseService){

	var vm = this;
	
	vm.init = function(){
		//nothing yet
	};
	
	vm.submitUrl = function(url){
		ReverseService.get({url: url}, function(response){
			console.log(response);
		});
	};

	vm.init();
	
}]);