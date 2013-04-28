define([
	'text!views/feed/feed.html',
	'views/feed/post-form/PostFormView',
	'views/feed/post/PostView',
	'models/PostModel'
], function(html, PostFormView, PostView, PostModel) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this,
				'render',
				'onAddPost',
				'onPostAdded',
				'onPostRemoved'
			);
			this.el = $(_.template(html, {}));
			this.$posts = this.el.find('#posts');
			this.$postForm = this.el.find('#post-form');
			this.posts = null;
			this.postViews = {};
			this.postFormView = new PostFormView();
			this.$postForm.html(this.postFormView.el);
			this.postFormView.bind('add_post', this.onAddPost);
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

		onAddPost: function(postData) {
			this.posts.add(new PostModel(postData));
		},

		onPostAdded: function(postModel) {
			var view = new PostView({'model': postModel});
			view.el.hide();
			this.$posts.prepend(view.el);
			view.el.slideDown();
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