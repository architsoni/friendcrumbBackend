var express = require('express');
var app = express();
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

var mongoose = require('mongoose'), bodyParser = require('body-parser');
var morgan = require('morgan'), methodOverride = require('method-override');
var config = require('./dbConfig/config');
var port = process.env.PORT || 8080;

var router = express.Router();

mongoose.connect(config.remoteUrl);

//router-level middleware, this is executed for wevery connection to router 
// router.use(function(req, res, next) {
//     //console.log('Something is happening.');
//     next(); // make sure we go to the next routes and don't stop here
// });

// io.on('connection', function(socket) {
// 	socket.on('eventUpdated', function(event){
// 		//
// 	});
// });

//app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

require('./server/routes.js')(app);

app.listen(port);
console.log("App listening on port " + port)