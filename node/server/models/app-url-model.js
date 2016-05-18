var mongoose = require('mongoose');
var schema = mongoose.Schema;

var appUrlSchema = new schema({
	redirect_url : {
		type : String,
		required :true
	}
});

var appUrl = module.exports = mongoose.model('AppUrl', appUrlSchema);

module.exports = {
	addAppUrl : function(request, callBack){
		appUrl.create(request, callBack);
	},
	getAppUrl : function(id, callBack){
		appUrl.findById(id, callBack);
	},
	getAllAppUrls : function(request, callBack){
		appUrl.find(callBack);
	},
	deleteAppUrl : function(id, callBack){
		var req = {
			_id: id
		};
		appUrl.findByIdAndRemove(req, callBack);
	},
	deleteAll : function(callBack){
		appUrl.remove({}, callBack);
	}
}