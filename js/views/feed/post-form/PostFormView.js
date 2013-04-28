define(['text!views/feed/post-form/post-form.html'], function(html) {
	return Backbone.View.extend({
		initialize: function(){
			_.bindAll(
				this,
				'onClick'
			);
			this.el = $(_.template(html, {}));
			this.$submitButton = this.el.find('#post-submit');
			this.$title = this.el.find('#post-title');
			this.$body = this.el.find('#post-body');

			this.$submitButton.click(this.onClick);
		},

		onClick: function(e) {
			this.trigger('add_post', {
				'title': this.$title.val(),
				'body': this.$body.val()
			});

			this.$title.val('');
			this.$body.val('');
			this.$image.replaceWith(this.$image = this.$image.val('').clone(true));
			this.image = null;
		}
	});
});