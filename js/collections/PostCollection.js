define(['models/PostModel'], function(PostModel) {
	return Backbone.Collection.extend({
		'model': PostModel,
		'comparator': function(postModel) {
			if(postModel.get('created_date')) {
				// Split timestamp into [ Y, M, D, h, m, s ]
				var t = postModel.get('created_date').split(/[- :]/);
				// Apply each element to the Date function
				var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
				return -1*d.getTime();
			}
			return 1;
		}
	});
});