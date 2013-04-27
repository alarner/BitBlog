define(['text!views/feed/feed.html'], function(html) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this,
				'onClick'
			);
			this.el = $(_.template(html, {}));
			// this.$submitButton = this.el.find('#post-submit');
			// this.$title = this.el.find('#post-title');
			// this.$body = this.el.find('#post-body');


			// this.$submitButton.click(this.onClick);
		},

		onClick: function(e) {
			message = {
				'title': this.$title.val(),
				'body': this.$body.val()
			};
			window.socket.send(JSON.stringify(message));
		}
	});
});