var mongoose = require('mongoose');
//var userModel = require('./user-model'); 
var schema = mongoose.Schema;

var invitees = new schema({
	name : String,
	//email : String,
	status : String,
	user_id : String,
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
		// my_status : {
		// 	type : String
		// }, 
		// organiser : {
		// 	type : String,
		// 	required : true
		// },
		// organiser_email : {
		// 	type : String,
		// 	//required : true
		// },
		event_date : {
			type : String,//Date,
			required : true,
			//default : Date.now
		},
		user_id : {
			type : String, //schema.Types.ObjectId,
			required : true,
			//ref : mongoose.model('User')
		},
		event_id :{
			type: String,
		},
		invitee_list : [invitees],
		// invitee_list : {
		// 	type : Array,
		// 	required : true
		// } 
});

var event = module.exports = mongoose.model('Event',eventSchema);

/* CRUD Methods*/

module.exports = {
	getEventById : function(userId, eventId, callBack){
		var req = {
			event_id: eventId, 
			user_id: userId
		};
		event.findOne(req, callBack);
	},

	getAllEvents : function(userId, callBack){
		var req = {
			user_id: userId
		};
		event.find(req, callBack);
	},

	createEvent : function(eventObj, callBack){
		event.create(eventObj, callBack);
	},

	updateEvent : function(eventObj, callBack){
		event.update({event_id: eventObj.event_id, user_id: eventObj.user_id}, eventObj, callBack);
	},

	addEventToAttendeeList : function(eventObjt, callBack){
		var inviteeList = eventObjt.invitee_list;
		//handle the case when an attendee is not registerd for fc??
		inviteeList.forEach(function(value, index){
			var eventObj = JSON.parse(JSON.stringify(eventObjt)); //peculiar behavior.. after updating eventObjt, it is affecting in calling function also??
			eventObj.user_id = value.user_id;
			//create new document for that invitee
			event.create(eventObj, function(err, evnt){
				if((inviteeList.length -1) == (index)) {
					var req = {
						event_id: eventObjt.event_id, 
						user_id:  eventObjt.user_id
					};
					event.findOne(req, callBack);
				}
			});
		});
	},

	updateAttendeeEventList : function(eventObjt, callBack){
		var inviteeList = eventObjt.invitee_list;
		inviteeList.forEach(function(value, index){
			var eventObj = JSON.parse(JSON.stringify(eventObjt));
			eventObj.user_id = value.user_id;
			event.update({event_id: eventObj.event_id, user_id: value.user_id}, eventObj, function(err, evnt){
				if((inviteeList.length -1) == (index)) {
					var req = {
						event_id: eventObjt.event_id, 
						user_id:  eventObjt.user_id
					};
					event.findOne(req, callBack);
				}
			});
		});
	},

	deleteEvent:  function(request, callBack){
		var eventId = request.event_id, userId = request.user_id;
		var callBackResp = {};
		var req = {
			event_id : eventId,
			user_id : userId
		};
		event.remove(req, function(err, evnt){
			if(!err){
				event.update({event_id: eventId, 'invitee_list.user_id' : userId}, {$set: {'invitee_list.$.status' : "DECLINED"}}, {multi: true}, function(err, resp){
					if(err){
						callBackResp.status = "";
						callBackResp.msg = "failed to update the event status to invitees";
					}
					else{
						callBackResp.status = "success";
						callBackResp.msg = "";
					}
					callBack(callBackResp);
				});
			}
			else{
				callBackResp.status = "";
				callBackResp.msg = "failed to decline the event";
				callBack(callBackResp);
			}
		});
	},

	deleteAllEvents:  function(userId, callBack){
		var req = {
			user_id : userId
		};
		event.remove(req, callBack);
	},

	updateAttendeeStatus:  function(request, callBack){
		var userId = request.user_id, eventId = request.event_id, eventStatus = request.status;
		var callBackResp = {};
		// var req = {
		// 	event_id : request.event_id,
		// 	user_id : request.user_id
		// };
		
		//event.update({event_id: request.event_id}, {$set: { 'invitee_list.0.status' : request.status }}, {multi: true}, callBack); 
		//event.update({event_id : request.event_id}, {$set: { 'invitee_list.$.status' : request.status }}, { invitee_list: { $elemMatch: { status: request.user_id } } }, {multi: true}, callBack);

		event.update({event_id: eventId, 'invitee_list.user_id' : userId}, {$set: {'invitee_list.$.status' : eventStatus}}, {multi: true}, function(err, resp){
			if(err){
				callBackResp.status = "";
				callBackResp.msg = "failed to update the event status to invitees";
			}
			else{
				callBackResp.status = "success";
				callBackResp.msg = "";
			}
			callBack(callBackResp);
		});
		
	},

	clearAllEvents:  function(callBack){
		event.remove({}, callBack);
	}
}
