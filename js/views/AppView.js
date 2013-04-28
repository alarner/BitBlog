define([
	'views/feed/FeedView',
	'collections/PostCollection',
	'models/PostModel'
], function(FeedView, PostCollection, PostModel) {
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
					console.log('onmessage');
					console.log(message.data);
					var postObj = JSON.parse(message.data);
					var postModel = null;
					if(postObj.cid) {
						postModel = posts.get(postObj.cid);
						delete postObj.cid
					}
					else {
						postModel = posts.get(postObj.id);
					}

					if(postModel) {
						postModel.set(postObj);
						posts.sort();
					}
					else {
						posts.add(new PostModel(postObj));
					}					
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
			window.socket.send(JSON.stringify(postObj));
		}
	});
});