var mongoose = require('mongoose');
var schema = mongoose.Schema;

var appUrl = new schema({
	redirect_url : {
		type : String,
		required :true
	}
});

var appUrl = module.exports = mongoose.model('AppUrl', appUrl);

module.exports = {
	addUrl : function(request, callBack){
		appUrl.create(request, callBack);
	},
	getUrl : function(id, callBack){
		appUrl.findById(id, callBack);
	}
}