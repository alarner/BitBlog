#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var watch = require('node-watch');
var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');
var settings = require('./settings');
settings.my_dir = path.normalize(settings.my_dir);
settings.base_follow_dir = path.normalize(settings.base_follow_dir);

var writeableDir = '/Users/alarner/Documents/node/BtNetwork/3SNMAXPJDF7GEIHZVLY2L6TFNTVNZQEG/';

var server = http.createServer(function(request, response) {
	console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});
server.listen(8080, function() {
	console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	autoAcceptConnections: false
});

function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

wsServer.on('request', function(request) {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}

	var connection = request.accept('echo-protocol', request.origin);
	console.log((new Date()) + ' Connection accepted.');
	// connection.sendUTF('test');
	connection.on('message', function(message) {
		if(message.type === 'utf8') {
			var messageData = JSON.parse(message.utf8Data);
			if(messageData.type == 'post') {
				var d = new Date();
				var postObj = messageData.post;
				var cid = null;
				if(!postObj.id) {
					postObj.id = uuid.v4();
					postObj.user_id = settings.my_read_only;
					cid = postObj.cid;
					delete postObj.cid;
					postObj.created_date = 
						pad(d.getUTCFullYear(), 4)+'-'+
						pad((d.getUTCMonth()+1), 2)+'-'+
						pad(d.getUTCDate(), 2)+' '+
						pad(d.getUTCHours(), 2)+':'+
						pad(d.getUTCMinutes(), 2)+':'+
						pad(d.getUTCSeconds(), 2);
				}
				var filepath = '';
				if(postObj.user_id == settings.my_read_only) {
					filepath += settings.my_dir;
				}
				else {
					filepath += settings.base_follow_dir;
				}
				filepath += postObj.id;
				fs.writeFile(filepath, JSON.stringify(postObj), function(err) {
					if(err) {
						console.log(err);
					} else if(postObj.user_id == settings.my_read_only) {
						console.log("The file was saved!");
						if(cid) postObj.cid = cid;
						connection.sendUTF(JSON.stringify(postObj));
					}
				});
			}
			
			// connection.sendUTF(message.utf8Data);
		}
		// else if (message.type === 'binary') {
		// 	console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
		// 	connection.sendBytes(message.binaryData);
		// }
	});
	// connection.on('close', function(reasonCode, description) {
	// 	console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	// });

	function onFileChanged(filename) {
		var filepath = path.normalize(filename);
		var pieces = filepath.split(path.sep);
		var hidden = false;
		for(var i=0; i<pieces.length; i++) {
			if(pieces[i].substring(0,1) == '.') {
				hidden = true;
			}
		}
		if(!hidden) {
			fs.readFile(filename, 'utf8', function(err, data) {
				if(err) {
					return console.log(err);
				}
				else {
					console.log(data);
					connection.sendUTF(data);
				}
			});
			
			console.log(filename, ' changed.');
		}
	}

	for(var i in settings.follow_dirs) {
		if(settings.follow_dirs.hasOwnProperty(i)) {
			watch(settings.base_follow_dir+i, onFileChanged);
		}
	}
});

function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}