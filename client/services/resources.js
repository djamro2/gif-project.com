/* global angular */
var factories = factories || angular.module('GifProject.factories', []);

//will return the url to a newly reversed gif that I am hosting
factories.factory('ReverseService', function($resource){
	return $resource('/api/reverse/:url', {url: '@url'}, {
		update: {method: 'PUT'},
		checkIfExists: {method: 'GET', 
						url: '/api/check/:url', 
						params: {url: '@url'}, isArray: false}
	});
});
