define(['text!views/feed/post/post.html'], function(html) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this,
				'render'
			);
			this.el = $(_.template(html, {'model': this.model}));
			this.$title = this.el.find('title');
			this.$body = this.el.find('body');
			this.model.bind('change', this.render);
		},

		render: function() {
			this.$body.html(this.model.get('body'));
			this.$title.text(this.model.get('text'));
		}
	});
});