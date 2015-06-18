var socket = io();

var app = angular.module('app', []);

app.controller('messageCtrl', ['$scope', function($scope) {
	$scope.nickname = "XXX";
	$scope.messageText = "";
	$scope.rejected = false;
	$scope.messages = [];
	$scope.send = function() {
		if ($scope.messageText) {
			socket.emit("message", $scope.messageText);
			$scope.messageText = "";
		}
	}

	socket.on('getNickname', function(data) {
		$scope.$apply(function() {
			$scope.nickname = data;
		});
	});

	socket.on('sendback', function(data) {
		$scope.$apply(function() {
			$scope.messages.push(data);
		});

		$(".messages").scrollTop($(".messages").prop("scrollHeight"));
	});

	socket.on('connectionRejected', function() {
		$scope.$apply(function() {
			$scope.rejected = true;
		});
	})
}]);