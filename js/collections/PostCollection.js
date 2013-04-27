define(['models/PostModel'], function(PostModel) {
	return Backbone.Collection.extend({
		model: PostModel
	});
});