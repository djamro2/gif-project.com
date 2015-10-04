/* global moment */
/* global angular */
'use strict';

var directives = directives || angular.module('GifProject.directives', []);

directives.directive('gifBox', ['ReverseService', function(ReverseService){

	return {
		restrict: 'A',
		replace: true,
		link: function(scope, element, attrs) {

			scope.gifContainerObject.clear = function(){
				element.empty();
			};

			scope.gifContainerObject.setSpinner = function(callback){
				element.empty();
				element.append('<div class="gif-container loading">' +
								'<p>Gif is currently being reversed/retrieved</p>' +
								'<p class="u">It takes up to 3 minutes to reverse (sorry)</p>' +
								'<img class="gif" src="/content/images/hourglass.gif" />' +
								'</div>');
				callback();
			};

			scope.gifContainerObject.setGif = function(gifId) {
				//only set gif it exists
				ReverseService.checkIfExists({url: gifId}, function(result){
					if (result.exists) {
						element.empty();
						element.append('<div class="gif-container">' +
										'<img class="gif" src="/gif/' + gifId + '"" />' +
										'</div>');
					} else {
						element.empty();
						scope.vm.errorMessage = 'Sorry! There was a problem reversing/getting this gif!';
					}
				});

			};

		}
	};

}]);