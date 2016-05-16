var userSchema = require('./models/user-model'); 
var eventSchema = require('./models/event-model');
var appUrlSchema = require('./models/app-url-model'); 

var idgen = require('idgen');

module.exports = function(app){
	
	//for allowing cross-origin requests
	app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With,X-Powered-By,Content-Type");
        if (req.method === 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
     });

	app.get('/',function(req, res){
		res.send('use api/users to communicate');
	});

	app.get('/api/users',function(req, res){
		getAllUsers(res);
	});

    app.get('/api/users/:userId', function(req, res){
        getUserById(req, res);
    });

	app.post('/api/users', function(req, res){
		// create a todo, information comes from AJAX request from Angular
        // var newUser = new User(req.body);

        // newUser.save(function(err){
        //     if(err)
        //         res.send(err);

        //     res.json({message: 'User created'});
        // })


        /*userSchema.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            done: false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getAllUsers(res);
        });*/
        var userObj = req.body;
        userSchema.addUser(userObj, function(err, user){
            if(err)
                res.send(err);
            //res.json(user);
            getAllUsers(res);
        });
	});

    app.put('/api/users/:userId',function(req, res){
        userSchema.updateUser(req.params._id, req.body, function(err, user){
            if(err)
                res.send(err);
            //res.send(user);
            getUserById(req, res);
        });
    });

    app.delete('/api/users/:userId', function(req, res){
        userSchema.removeUser(req.params.userId, function(err, user){
            if(err)
                res.send(err);
            res.json(user);
        });
    });


    /*Event related apis*/

    app.get('/api/events/:phone_no', function(req, res){
        getAllEvents(req, res);
    });

    app.get('/api/events/:phone_no/:event_id', function(req, res){
        getSpecificEvent(req, res);
    });

    app.post('/api/events/', function(req, res){
        var  eventObj = req.body;
        eventObj.event_id = idgen(16); //generate eventId 
       
        //update invitees event list with this event
        eventSchema.addEventToAttendeeList(eventObj);

        eventSchema.createEvent(eventObj, function(err, user){
            if(err)
                res.send(err);
            res.json(user);
            //getAllEvents(req,res);
        }); 
    });

     app.put('/api/events/', function(req, res){
        var  eventObj = req.body;

        //update invitees event list with this event
        eventSchema.updateAttendeeEventList(eventObj);
        
        eventSchema.updateEvent(eventObj, function(err, event){
            if(err)
                res.send(err);
            res.json(event);
        });
     });

     //when organiser cancel's an event 
     app.delete('/api/events/deleteEvent/', function(req, res){
        eventSchema.deleteEvent(req.body, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });

     //when attendees accept/decline an event
     app.put('/api/events/updateEventStatus', function(req, res){
        eventSchema.updateAttendeeStatus(req.body, function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     //for local testing only
     app.delete('/api/users/deleteAll/', function(req, res){
        userSchema.removeAllUsers(function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.delete('/api/events/deleteAll/', function(req, res){
        eventSchema.clearAllEvents(function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.delete('/api/events/deleteAllEvents/', function(req, res){
        eventSchema.deleteAllEvents(req.body.phone_no, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });

     app.post('/api/appUrls', function(req, res){
        appUrlSchema.addUrl(req.body, function(err, resp){
            if(err)
                res.send(err);
            res.json(resp);
        });
    });

     app.get('/api/appUrls/:appId', function(req, res){
        appUrlSchema.getUrl(req.params.appId, function(err, resp){
             if(err)
                res.send(err);
            res.json(resp);
        });
     });
};

function getUserById(req, res){
    userSchema.getUserById(req.params.userId, function(err, user){
        if(err)
            res.send(err);
        res.json(user);
    });
};

function getAllUsers(res){

    //moved to users.js
	/*userSchema.find(function(err, response){
		if(err)
			res.send(err);

		res.json(response);

	});*/

    userSchema.getUsers(function(err, users){
        if(err)
            res.send(err);
        res.json(users);
    });

};

function getSpecificEvent(req, res){
     eventSchema.getEventById(req.params.phone_no, req.params.event_id, function(err, user){
            if(err)
                res.send(err);
            res.json(user);
        });
};

function getAllEvents(req, res){
    eventSchema.getAllEvents(req.params.phone_no, function(err, users){
        if(err)
            res.send(err);
        res.json(users);
    });
};