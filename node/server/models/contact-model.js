var mongoose = require('mongoose');
var schema = mongoose.Schema;

var contactList = new schema({
	name: {
		type: String,
		required: true
	},
	contact_id: {
		type: String,
		required: true,
		//unique: true
	},
	profile_pic:{
		type : String
	},
	// phone_no:{
	// 	type: String,
	// 	required: true
	// },
	_id : false,

});

var contactSchema = new schema({
	user_id: {
		type : String,
		required : true,
		unique: true
	},
	contact_list : [contactList]
});

var contact = module.exports = mongoose.model('Contact', contactSchema);

module.exports = {
	getContacts : function(userId, callBack){
		var req = {
			user_id: userId
		};
		contact.findOne(req, callBack);	
	},
	addContacts : function(request, callBack){
		contact.create(request, callBack);
	},
	deleteContacts : function(userId, callBack) {
		var req = {
			user_id : userId
		};
		contact.remove(req, callBack);
	}
};