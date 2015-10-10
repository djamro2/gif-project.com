/* global moment */
/* global angular */
'use strict';

var controllers = controllers || angular.module('GifProject.controllers', []);

controllers.controller('GifController', ['$scope', '$routeParams', '$location', '$window', 'ReverseService', '$timeout',
	function($scope, $routeParams, $location, $window, ReverseService, $timeout){

	$scope.gifContainerObject = {};

	var vm = this;
	vm.errorMessage = '';
	
	vm.init = function(){

		var currentUrl = $window.location.href;
		var textToFind = 'path?url';
		var cutoff = currentUrl.indexOf(textToFind);
		var url = currentUrl.substring(cutoff + textToFind.length + 1, currentUrl.length);

		//transform the url here to meet requirements
		if (url.indexOf('.gifv') > -1 && url.indexOf('imgur') > -1){ //gifv to gif
			url = url.substring(0, url.length - 1);
		}

		if (url.indexOf('https') > -1) {
			url = url.replace('https', 'http');
		}

		url = decodeURIComponent(url);

		$scope.GifUrl = url;

		$timeout(function(){

			$scope.gifContainerObject.setSpinner(function(){ //set spinner first
				
				ReverseService.get({url: url}, function(response){
					if (response) {
						$scope.gifContainerObject.setGif(response.url);
						vm.errorMessage = false;
					} else {
						$scope.gifContainerObject.clear();
						vm.errorMessage = 'Sorry! There was a problem reversing this gif!';
					}
				}, function(error){
					$scope.gifContainerObject.clear();
					vm.errorMessage = 'Sorry! There was a problem reversing this gif!';					
				});
			
			});

		});
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