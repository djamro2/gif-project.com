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
	
	//goes to the correct url, which will either retreive the gif and/or convert it
	vm.submitUrl = function(url){
		if (!url) {
			vm.errorMessage = 'url cannot be ' + (url? url : 'nothing');
			return;
		} else {
			vm.errorMessage = false;
		}

		$window.location.href = '/reverse/path?url=' + encodeURIComponent(url);
	};

	vm.init();
	
}]);