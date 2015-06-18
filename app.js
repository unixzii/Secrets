var http = require('http');
var express = require('express');
var socketio = require('socket.io');

var nicknames = ["莴苣", "花椰菜", "冬瓜", "黄瓜", "苦瓜", "番茄", "生姜", "韭菜", "马铃薯", "花生", "黄豆", "梅菜", "胡萝卜", "茄子", "莴笋", "油菜", "白菜", "荠菜"];
var users = [];

// Setup the express app and servers.
var app = express();
app.use(express.static(__dirname + '/statics'));
var server = http.Server(app)
var io = socketio(server);

// Config app routes.
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// Config Socket.io events.
io.on('connection', function(socket) {
	for (var i = 0; i < nicknames.length; i++) {
		var nameIsUsed = false;

		for (var j = 0; j < users.length; j++) {
			if (users[j].nickname == nicknames[i]) {
				nameIsUsed = true;
				break;
			}
		}

		if (!nameIsUsed) {
			socket.nickname = nicknames[i];
			users.push(socket);
			break;
		}
	}

	if (socket.nickname != undefined) {
		console.log("New connection.Nickname is " + socket.nickname);
		socket.emit("getNickname", socket.nickname);
		var messageBody = {
			'system': true,
			'user': socket.nickname,
			'message': socket.nickname + ' 加入聊天室'
		};
		socket.broadcast.emit("sendback", messageBody)

		socket.on('message', function(data) {
			var messageBody = {
				'system': false,
				'user': socket.nickname,
				'message': data
			};

			socket.emit("sendback", messageBody);
			socket.broadcast.emit("sendback", messageBody);
		});

		socket.on('disconnect', function() {
			for (var i = 0; i < users.length; i++) {
				if (users[i] == socket) {
					users[i] = users[users.length - 1];
					users.pop();
				}
			}
		});
	} else {
		socket.emit("connectionRejected");
	}
});

// Start the server.
server.listen(80, function() {
	console.log("Server started at port 80");
});