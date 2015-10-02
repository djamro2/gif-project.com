/* global moment */
/* global angular */
'use strict';

var controllers = controllers || angular.module('GifProject.controllers', []);

controllers.controller('GifController', ['$scope', '$routeParams', '$location', '$window', 'ReverseService',
	function($scope, $routeParams, $location, $window, ReverseService){

	var vm = this;
	
	vm.init = function(){

		var currentUrl = $window.location.href;
		var textToFind = 'path?url';
		var cutoff = currentUrl.indexOf(textToFind);
		var url = currentUrl.substring(cutoff + textToFind.length + 1, currentUrl.length);

		$scope.GifUrl = decodeURIComponent(url);

		ReverseService.get({url: url}, function(response){ //(?convert and) get the gif
			console.log(response);
			$scope.gifId = response.url;
		});
	};

	vm.init();
	
}]);