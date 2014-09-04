$(function(){
	$(document).ready(function(){
		angular.bootstrap($('#main'), ["NodeBot"]);
	});

	var module = angular.module('NodeBot', ['ng', 'ngResource']);

	module.factory('nbApi', ['$resource', function ($resource){
		return $resource(
			'/:action',
			{ direction: '@direction', foot: '@foot', rate: '@rate' },
			{
				rotate: {method:'POST', params: {action: 'rotate', hacker: 'notahacker'}},
				stop: {method:'POST', params: {action: 'stop', hacker: 'notahacker'}},
				forward: {method:'POST', params: {action:'move', direction:'forward', hacker: 'notahacker'}},
				back: {method:'POST', params: {action:'move', direction:'back', hacker: 'notahacker'}}
			}
		);
	}]);

	module.controller('botController', ['$rootScope', '$scope', 'nbApi', function($rootScope, $scope, nbApi){
		$scope.status = "Not Initialized";

		var lastAction = angular.noop;

		function performAndSave(action)	{
			lastAction = action;
			action();
		};

		$scope.rotate = function(direction)	{
			performAndSave( function() {
				nbApi.rotate({direction: direction, rate: $scope.rate});
			} );
		};

		$scope.stop = function() {
			performAndSave( function() {
				nbApi.stop();
			} );
		};

		$scope.forward = function(foot) {
			performAndSave( function() {
				nbApi.forward({foot: foot, rate: $scope.rate});
			} );
		};

		$scope.back = function(foot) {
			performAndSave( function() {
				nbApi.back({foot: foot, rate: $scope.rate});
			} );
		};

		$scope.goSlow = function() {
			$scope.rate = 0.05;
			lastAction();
		};

		$scope.goFast = function() {
			$scope.rate = 1;
			lastAction();
		};
		
		$scope.onKeyup = function($event) {
			switch ($event.keyCode)
			{
			case 38:
			case 40:
				break;
			
			default:
				$scope.stop();
				break;
			}
		};

		$scope.onKeydown = function($event) {
			switch ($event.keyCode)
			{
			case 87: //W
				$scope.forward('both');
				break;

			case 83: //S
				$scope.back('both');
				break;

			case 65: //A
				if ($event.shiftKey) {
					$scope.rotate('counterclockwise');
				} else {
					$scope.forward('right');
				}
				break;

			case 68: //D
				if ($event.shiftKey) {
					$scope.rotate('clockwise');
				} else {
					$scope.forward('left');
				}
				break;

			case 32: //SPACE
				$scope.stop();
				break;

			case 40: //DOWN
				$scope.goSlow();
				break;

			case 38: //UP
				$scope.goFast();
				break;
			}
		};
	}]);
});