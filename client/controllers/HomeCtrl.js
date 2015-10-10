/* global moment */
/* global angular */
'use strict';

var controllers = controllers || angular.module('GifProject.controllers', []);

controllers.controller('HomeController', ['$scope', '$window', 'ReverseService',
	function($scope, $window, ReverseService){

	var vm = this;
	vm.errorMessage = '';
	
	vm.init = function(){
		//nothing yet
	};
	
	//return true if the url seems to alright, false otherwise
	vm.checkURL = function(url){

		return true;

	};

	//goes to the correct url, which will either retreive the gif and/or convert it
	vm.submitUrl = function(url){
		var valid = vm.checkURL(url);
		if (!url || !valid) {
			vm.errorMessage = 'url cannot be ' + (url? url : 'nothing');
			return;
		} else {
			vm.errorMessage = false;
		}

		$window.location.href = '/reverse/path?url=' + encodeURIComponent(url);
	};

	vm.init();
	
}]);