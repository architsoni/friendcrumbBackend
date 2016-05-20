var mongoose = require('mongoose');
var schema = mongoose.Schema;

var eventTrackingSchema = new schema({
	title : {
		type : String,
		//required : true
	},
	location : {
		type : String,
		//required : true
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
		required : true,
		unique: true
	},
	invitee_list : [{
		name : {
			type : String,
			//required : true
		},
		user_id : {
			type : String,
			required : true
		},
		position : {
			lat : {
				type : Number,
				//required: true 
			},
			lng : {
				type : Number,
				//required : true
			}
		},
		_id : false
	}]
});

var eventTrack = module.exports = mongoose.model('EventTrack', eventTrackingSchema);

module.exports = {
	updatePosition : function(request, callBack){
		var userId = request.user_id, eventId = request.event_id, userPos = request.position;
		//var callBackResp = {};
		eventTrack.update({event_id: eventId, 'invitee_list.user_id' : userId}, {$set: {'invitee_list.$.position' : userPos}}, function(err, res){//{upsert: true}, {$addToSet: {'invitee_list' : request}}, {$push : {'invitee_list' : request}},
			if(!err){
				eventTrack.findOne({event_id: eventId}, function(error, resp){
					var inviteeList = resp.invitee_list;
					callBack(inviteeList);
				});
			}
		});
	},
	addTrackingEvent : function(eventObj, callBack){
		//var req = { event_id : eventObj.event_id};
		eventTrack.create(eventObj, callBack);
	},
	getTrackingEvent : function(eventId, callBack){
		var req = {
			event_id: eventId, 
		};
		eventTrack.findOne(req, callBack);
	},
	removeTrackingEvent : function(request, callBack){
		var req = {
			event_id : request.event_id
		};
		eventTrack.remove(req, callBack);
	}
};