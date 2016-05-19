var mongoose = require('mongoose');

var schema = mongoose.Schema;
var objectId = schema.ObjectId;

var userSchema = new schema({
	name:{
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true,
		unique: true
	}, 
	email_id:{
		type: String,
		//unique: true
	},
	profile_pic:{
		type : String
	}
	/*phone_no: {
		type:  String,
		required: true,
		unique: true 
	 }*/
	//,
	// "_id":{
	// 	type: String,
	// 	required: true
	// }
});

// userSchema.pre('save',function(next){
// 	if(this.isNew)
// 		this._id = this.phone;
// 	next();
// });

var user = module.exports = mongoose.model('User',userSchema);

//for refering the user in event schema
//module.exports.user = user;


// userSchema.virtual('userId').get(function() {
//     return this._id;
// });

/* CRUD Methods*/

module.exports = {
	getUserById : function(userId, callBack){
		user.findOne(userId, callBack);
	},
	getUsers : function(callBack){
		user.find(callBack);
	},
	addUser : function(userObj, callBack){
		user.create(userObj, callBack);
	},
	updateUser : function(userId, userObj, callBack){
		var req = {
			user_id: userId
		};
		user.findOneAndUpdate(req, userObj, callBack);
	},
	removeUser : function(userId, callBack){
		var req = {
			user_id: userId
		};
		user.remove(req, callBack);
	},
	removeAllUsers : function(callBack){
		user.remove({}, callBack);
	}
};

