define([
	'text!views/feed/feed.html',
	'views/feed/post/PostView'
], function(html, PostView) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this,
				'render',
				'onPostAdded',
				'onPostRemoved'
			);
			this.el = $(_.template(html, {}));
			this.$posts = this.el.find('#posts');
			this.posts = null;
			this.postViews = {};


			// this.$submitButton = this.el.find('#post-submit');
			// this.$title = this.el.find('#post-title');
			// this.$body = this.el.find('#post-body');


			// this.$submitButton.click(this.onClick);
		},

		render: function(posts) {
			if(this.posts) {
				this.posts.unbind('add', this.onPostAdded);
				this.posts.unbind('remove', this.onPostAdded);
			}
			this.posts = posts;
			this.posts.bind('add', this.onPostAdded);
			this.posts.bind('remove', this.onPostRemoved);

			this.$posts.html('');
			this.postViews = {};
			var self = this;
			this.posts.each(function(postModel) {
				var view = new PostView({'model': postModel});
				self.$posts.append(view.el);
				self.postViews[postModel.id] = view;
			});
		},

		onPostAdded: function(postModel) {
			var view = new PostView({'model': postModel});
			this.$posts.prepend(view.el);
			this.postViews[postModel.id] = view;
		},

		onPostRemoved: function(postModel) {
			if(this.postViews[postModel.id]) {
				this.postViews[postModel.id].el.remove();
				delete this.postViews[postModel.id];
			}
		}
	});
});