var mongoose = require('mongoose');
var schema = mongoose.Schema;

var contacts = new schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	phone_no:{
		type: String,
		required: true
	},
	_id : false,

});

var contactSchema = new schema({
	// userId : {
	// 	type : schema.Types.ObjectId,
	// 	required : true,
	// 	ref : mongoose.model('User')

	// },
	phone_no: {
		type : String,
		required : true
	},
	contact_list : [contacts]

});