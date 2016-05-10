var mongoose = require('mongoose');
//var userModel = require('./user-model'); 
var schema = mongoose.Schema;

var invitees = new schema({
	name : String,
	//email : String,
	status : String,
	phone_no : String,
	_id : false,
});

var eventSchema = new schema({
		title : {
			type : String,
			required: true 
		},
		location : {
			type : String,
			required: true 
		},
		description : {
			type : String
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
		my_status : {
			type : String
		}, 
		organiser : {
			type : String,
			required : true
		},
		organiser_email : {
			type : String,
			//required : true
		},
		event_date : {
			type : String,//Date,
			required : true,
			//default : Date.now
		},
		phone_no : {
			type : String, //schema.Types.ObjectId,
			required : true,
			//ref : mongoose.model('User')
		},
		"event_id":{
			type: String,
		},
		invitee_list : [invitees],
		// invitee_list : {
		// 	type : Array,
		// 	required : true
		// } 
});

var event = module.exports = mongoose.model('Event',eventSchema);

// eventSchema.virtual('event_id').get(function() {
//     return this._id;
// });

/* CRUD Methods*/

module.exports.getEventById  = function(phoneNo, eventId, callBack){
	var req = {
		event_id: eventId, 
		phone_no: phoneNo
	};
	event.findOne(req, callBack);
};

module.exports.getAllEvents = function(phoneNo, callBack){
	var req = {
		phone_no: phoneNo
	};
	event.find(req, callBack);
};

module.exports.createEvent = function(eventObj, callBack){
	event.create(eventObj, callBack);
};

module.exports.updateEvent = function(eventObj, callBack){
	event.update({event_id: eventObj.event_id, phone_no: eventObj.phone_no}, eventObj, callBack);
};

module.exports.addEventToAttendeeList = function(eventObjt){
	var inviteeList = eventObjt.invitee_list;
	//handle the case when an attendee is not registerd for fc??
	inviteeList.forEach(function(value, index){
		var eventObj = JSON.parse(JSON.stringify(eventObjt)); //peculiar behavior.. after updating eventObjt, it is affecting in calling function also??
		// var query = {
		// 	event_id: eventObj.event_id,
		// 	phone_no: value.phone_no
		// };

		// event.findOne(query, function(err, response){
		// 	if(err)
		// 		throw err;
		// 	else{
				eventObj.phone_no = value.phone_no; // update the phone number with invitee phone number
				//create new document for that invitee
				event.create(eventObj, function(err, evnt){});
		// 	}
		// });

	});
	
};

module.exports.updateAttendeeEventList = function(eventObjt){
	var inviteeList = eventObjt.invitee_list;
	inviteeList.forEach(function(value, index){
		var eventObj = JSON.parse(JSON.stringify(eventObjt));
		eventObj.phone_no = value.phone_no; // update the phone number with invitee phone number
		event.update({event_id: eventObj.event_id, phone_no: value.phone_no}, eventObj, function(err, evnt){});
	});
};

module.exports.deleteEvent = function(eventId, callBack){
	var req = {
		event_id : request.event_id,
		//phone_no : request.phoneNo
	};
	event.remove(req, callBack);
};

module.exports.deleteAllEvents = function(phoneNo, callBack){
	var req = {
		phone_no : phoneNo
	};
	event.remove(req, callBack);
};

module.exports.updateAttendeeStatus = function(request, callBack){
	var phoneNo = request.phone_no, eventId = request.event_id, eventStatus = request.status;
	// var req = {
	// 	event_id : request.event_id,
	// 	phone_no : request.phone_no
	// };
	
	//event.update({event_id: request.event_id}, {$set: { 'invitee_list.0.status' : request.status }}, {multi: true}, callBack); 
	//event.update({event_id : request.event_id}, {$set: { 'invitee_list.$.status' : request.status }}, { invitee_list: { $elemMatch: { status: request.phone_no } } }, {multi: true}, callBack);

	event.update({event_id: eventId, 'invitee_list.phone_no' : phoneNo}, {$set: {'invitee_list.$.status' : eventStatus}}, {multi: true}, callBack);
	
};

module.exports.clearAllEvents = function(callBack){
	// var req = {
	// 	_id: id
	// };
	//event.findByIdAndRemove(req, callBack);
	event.remove({}, callBack);
};
