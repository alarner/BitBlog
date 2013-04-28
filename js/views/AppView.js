define([
	'views/feed/FeedView',
	'collections/PostCollection'
], function(FeedView, PostCollection) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this,
				'onPostAdded'
			);
			this.el = $('#app');

			var posts = new PostCollection([
				{'id': 1, 'title': 'title1', 'body': 'body1', 'created_date': '2013-04-27 18:42:00', 'updated_date': null},
				{'id': 2, 'title': 'title2', 'body': 'body2', 'created_date': '2013-04-27 18:42:00', 'updated_date': null},
				{'id': 3, 'title': 'title3', 'body': 'body3', 'created_date': '2013-04-27 18:42:00', 'updated_date': null},
				{'id': 4, 'title': 'title4', 'body': 'body4', 'created_date': '2013-04-27 18:42:00', 'updated_date': null},
			]);

			posts.bind('add', this.onPostAdded);

			// Connect to the "server"
			try {
  
				var socket;
				var host = 'ws://127.0.0.1:8080';
				window.socket = new WebSocket(host, 'echo-protocol');

				window.socket.onopen = function() {
					console.log('open');
					 // message('<p class="event">Socket Status: '+socket.readyState+' (open)');
				}

				window.socket.onmessage = function(message) {
					var postObj = JSON.parse(message.data);
					console.log(postObj);
					var postModel = null;
					if(postObj.cid) {
						console.log('test1');
						console.log(posts);
						postModel = posts.getByCid(postObj.cid);
						delete postObj.cid
					}
					else {
						console.log('test2');
						postModel = posts.get(postObj.id);
					}
					postModel.set(postObj);
					console.log(posts);
				}

				window.socket.onclose = function() {
					console.log('close');
					 // message('<p class="event">Socket Status: '+socket.readyState+' (Closed)');
				}

			} catch(exception){
				 // message('<p>Error'+exception);
				 console.log(exception);
			}

			this.feedView = new FeedView();
			this.el.append(this.feedView.el);

			this.feedView.render(posts);
		},

		onPostAdded: function(postModel) {
			var postObj = postModel.toJSON();
			if(!postObj.id) {
				postObj.cid = postModel.cid;
			}
			console.log(JSON.stringify(postObj));
			window.socket.send(JSON.stringify(postObj));
		}
	});
});