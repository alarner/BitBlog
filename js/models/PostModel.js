define([], function() {
	return Backbone.Model.extend({
		'defaults': {
			'id': null,
			'user_id': null,
			'title': null,
			'body': null,
			'image': null,
			'created_date': null,
			'updated_date': null
		}
	});
});