$(function(){
	$(document).ready(function(){
		angular.bootstrap($('#main'), ["NodeBot"]);
	});

	var module = angular.module('NodeBot', ['ng', 'ngResource']);

	module.factory('nbApi', ['$resource', function ($resource){
		return $resource(
			'/:action',
			{ direction: '@direction', foot: '@foot', rate: '@rate', scan: '@scan' },
			{
				rotate: {method:'POST', params: {action: 'rotate', hacker: 'notahacker'}},
				stop: {method:'POST', params: {action: 'stop', hacker: 'notahacker'}},
				forward: {method:'POST', params: {action:'move', direction:'forward', hacker: 'notahacker'}},
				back: {method:'POST', params: {action:'move', direction:'back', hacker: 'notahacker'}}
			}
		);
	}]);

	module.controller('botController', ['$rootScope', '$scope', '$timeout', 'nbApi', function($rootScope, $scope, $timeout, nbApi){
		$scope.status = "Not Initialized";
		$scope.action = '';
		$scope.scan = 'OFF';

		var lastAction = angular.noop;

		function performAndSave(action)	{
			lastAction = action;
			action();
		};

		$scope.rotate = function(direction)	{
			performAndSave( function() {
				$scope.action = direction === 'clockwise' ? '>' : '<';
				nbApi.rotate({direction: direction, rate: $scope.rate, scan: $scope.scan});
			} );
		};

		$scope.stop = function() {
			performAndSave( function() {
				$scope.action = 'STOP';
				nbApi.stop({scan: $scope.scan});
			} );
		};

		$scope.forward = function(foot) {
			performAndSave( function() {
				switch (foot)
				{
				case 'left':
					$scope.action = 'LF';
					break;

				case 'right':
					$scope.action = 'RF';
					break;

				case 'both':
					$scope.action = 'F';
					break;
				}
				nbApi.forward({foot: foot, rate: $scope.rate, scan: $scope.scan});
			} );
		};

		$scope.back = function(foot) {
			performAndSave( function() {
				switch (foot)
				{
				case 'left':
					$scope.action = 'LR';
					break;

				case 'right':
					$scope.action = 'RR';
					break;

				case 'both':
					$scope.action = 'R';
					break;
				}
				nbApi.back({foot: foot, rate: $scope.rate, scan: $scope.scan});
			} );
		};

		$scope.setScanner = function(setting) {
			$scope.scan = setting;
			lastAction();
		};

		$scope.goSlow = function() {
			$scope.isFast = false;
			$scope.isSlow = true;
			$scope.rate = 0.05;
			lastAction();
		};

		$scope.goFast = function() {
			$scope.isSlow = false;
			$scope.isFast = true;
			$scope.rate = 1;
			lastAction();
		};
		
		$scope.onKeyup = function($event) {
			console.log($event.keyCode);
			switch ($event.keyCode)
			{
			case 38:
			case 40:
			case 17: //CTRL
				break;
			
			default:
				if (!$scope.sticky) {
					$scope.stop();
				}
				$scope.sticky = false;
				break;
			}
		};

		$scope.onKeydown = function($event) {
			switch ($event.keyCode)
			{
			case 87: //W
			case 104://NUMPAD8
				$scope.forward('both');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 83: //S
			case 98://NUMPAD2
				$scope.back('both');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 65: //A
			case 103://NUMPAD7
				$scope.forward('right');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 68: //D
			case 105://NUMPAD9
				$scope.forward('left');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 97://NUMPAD1
				$scope.back('right');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 99://NUMPAD3
				$scope.back('left');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 32: //SPACE
			case 101: //NUMPAD5
				$scope.stop();
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 40: //DOWN
				$scope.goSlow();
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 38: //UP
				$scope.goFast();
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 39: //RIGHT
			case 102: //NUMPAD6
				$scope.rotate('clockwise');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;

			case 37: //LEFT
			case 100: //NUMPAD4
				$scope.rotate('counterclockwise');
				$scope.sticky = $event.ctrlKey;
				$event.preventDefault();
				break;
			}
		};

		$scope.stop();
		$scope.goFast();

		$timeout(function(){
			$('#main').focus();
		});
	}]);
});