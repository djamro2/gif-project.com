/* global moment */
/* global angular */
'use strict';

var controllers = controllers || angular.module('GifProject.controllers', []);

controllers.controller('GifController', ['$scope', '$routeParams', '$location', '$locationProvider', 'ReverseService',
	function($scope, $routeParams, $location, ReverseService){

	var vm = this;
	
	vm.init = function(){

		var paramValue = $routeParams.url;
		console.log(paramValue);
		//TODO get url
		//ReverseService.get({url: url}, function(response){ //(?convert and) get the gif
		//	vm.gifId = response.gifId;
		//});
	};

	vm.init();
	
}]);