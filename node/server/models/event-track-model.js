var mongoose = require('mongoose');
var schema = mongoose.Schema;


// var invitees = new schema({
// 	name : String,
// 	phone_no : String,
// 	positions : []
// 	_id : false,
// });

var eventTrackingSchema = new schema({
	title : {
		type : String,
		required : true
	},
	location : {
		type : String,
		required : true
	},
	coordinates : {
		lat : {
			type : Number,
			required: true 
		},
		lng : {
			type : Number,
			required : true
		}
	},
	event_id : {
		type : String,
		required : true
	},
	invitee_list : [{
		name : String,
		user_id : String,
		position : []
	},
	]
});

