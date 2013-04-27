define(['views/feed/FeedView'], function(FeedView) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this
			);
			this.el = $('#app');

			// Connect to the "server"
			try {
  
				var socket;
				var host = 'ws://127.0.0.1:8080';
				window.socket = new WebSocket(host, 'echo-protocol');

				window.socket.onopen = function() {
					console.log('open');
					 // message('<p class="event">Socket Status: '+socket.readyState+' (open)');
				}

				window.socket.onmessage = function(msg) {
					console.log(msg.data);
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
		}
	});
});