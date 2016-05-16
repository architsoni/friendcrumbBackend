var mongoose = require('mongoose');

var schema = mongoose.Schema;
var objectId = schema.ObjectId;

var userSchema = new schema({
	name:{
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	}, 
	phone_no: {
		type:  String,
		required: true,
		unique: true 
	 }//,
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

module.exports.getUserById  = function(id, callBack){
	user.findById(id, callBack);
};

module.exports.getUserByPhoneNo = function(phoneNo, callBack){
	var req = {
		phone: phoneNo
	};
	user.findOne(req, callBack);
};

var eventModel = require('./event-model'); 

module.exports.getUsers = function(callBack){
	user.find(callBack);
};

module.exports.addUser = function(userObj, callBack){
	user.create(userObj, callBack);
};

module.exports.updateUser = function(id, userObj, callBack){
	var req = {
		_id: id
	};
	user.findOneAndUpdate(req, userObj, callBack);
};

module.exports.removeUser = function(id, callBack){
	var req = {
		_id: id
	};
	//users.remove(req, callBack);
	user.findByIdAndRemove(req, callBack);
};

module.exports.removeAllUsers = function(callBack){
	user.remove({}, callBack);
}
