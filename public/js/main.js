$(function(){
	$(document).ready(function(){
		angular.bootstrap($('#main'), ["NodeBot"]);
	});

	var module = angular.module('NodeBot', ['ng', 'ngResource']);

	module.factory('nbApi', ['$resource', function ($resource){
		return $resource(
			'/:action',
			{ direction: '@direction', foot: '@foot' },
			{
				rotate: {method:'POST', params: {action: 'rotate'}},
				stop: {method:'POST', params: {action: 'stop'}},
				forward: {method:'POST', params: {action:'move', direction:'forward'}},
				back: {method:'POST', params: {action:'move', direction:'back'}}
			}
		);
	}]);

	module.controller('botController', ['$q', '$scope', 'nbApi', function($q, $scope, nbApi){
		$scope.status = "Not Initialized";

		$scope.rotate = function(direction)	{
			nbApi.rotate({direction: direction});
		};

		$scope.stop = function() {
			nbApi.stop();
		};

		$scope.forward = function(foot) {
			nbApi.forward({foot: foot});
		};

		$scope.back = function(foot) {
			nbApi.back({foot: foot});
		};
		
		$scope.$on('keyup', function() {
		} );

		$scope.$on('keydown', function() {
		} );
	}]);
});