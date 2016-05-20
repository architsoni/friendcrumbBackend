var friendCrumbs={
	api : {
		fcManager : function(){
			var self = this;
			var apiDomain = "http://192.168.2.68:8080";
			// change apiDomain to "http://localhost:8080" for local testing;
			self.redirectAppUrl = null;

			this.doAjax = function(url, method, request, successCB, failureCB){
				$.ajax({
				  type: method,
				  url: apiDomain + url,
				  data: request,
				  success : function (res, status) {
				  	if((status == "success") && (!res.errmsg)){
				  		successCB.call(null,res);
				  	}else{
				  		failureCB.call(null, res);
				  	}
				  },
				  // error : function (res, req) {
				  // 	console.log(res);
				  // },
				});
			};
			this.registerClientUrl = function(url){
				self.redirectAppUrl = url;
			};
			// this.checkFbLoginStatus = function(){
			// 	 FB.getLoginStatus(function(response) {
		 //        	self.statusChangeCallback(response);
		 //    	},);
			// };
			this.doFbLogin = function(){
				FB.login(function(response){
					self.statusChangeCallback(response);
				},{scope: 'public_profile,email,user_friends'});
			};
			this.statusChangeCallback = function(response) {
			    // The response object is returned with a status field that lets the
			    // app know the current login status of the person.
			    // Full docs on the response object can be found in the documentation
			    // for FB.getLoginStatus().
			    if (response.status === 'connected') {
			      // Logged into your app and Facebook.
			      self.getProfileInfo(response);
			    } else if (response.status === 'not_authorized') {
			      // The person is logged into Facebook, but not your app.
			      document.getElementById('fbLoginStatus').innerHTML = 'Please log ' +
			        'into this app.';
			    } else {
			      // The person is not logged into Facebook, so we're not sure if
			      // they are logged into this app or not.
			      document.getElementById('fbLoginStatus').innerHTML = 'Please log ' +
			        'into Facebook.';
			    }
			};
			this.getProfileInfo = function(loginRes){
				var friendsImage = [];
				var userId = loginRes.authResponse.userID; // for accessToken loginRes.authResponse.accessToken
				//to get user name and profile pic
				FB.api("/me?fields=name,id,picture,email",function(response){
					//console.log(response);
					var reqObj = {};
					reqObj.name = response.name;
					reqObj.user_id = response.id;
					reqObj.profile_pic = response.picture.data.url;
					self.doAjax("/api/users", "POST", reqObj, function(resp){
						self.getContactInfo(resp);
					}, function(resp){
						//handle failure callback
					});
				});
			};
			this.getContactInfo = function(userObj){
				FB.api("/me/friends?fields=name,id,picture", function (response) { //me/friends, //taggable_friends, invitable_friends
			    	if (response && !response.error) {
			        	var friends = response.data;
			        	//console.log(friends);
			        	var reqObj = {};
			        	reqObj.user_id = userObj.user_id;
			        	reqObj.contact_list = [];
			        	friends.forEach(function(friend, index){
			        		var obj = {};
			        		obj.name = friend.name;
			        		obj.contact_id = friend.id;
			        		obj.profile_pic = friend.picture.data.url;
			        		reqObj.contact_list.push(obj);
			        	});
			        	self.doAjax("/api/contacts", "POST", reqObj, function(resp){
							self.redirectToApp();
						}, function(resp){
							//handle failure callback
						});
			      	}
				});
			};
			this.redirectToApp = function(){
				window.location.href = self.redirectAppUrl + "?fbSyncDone=true";
			};
		}
	}
};
//misc code
//graph api to get friends name & profile pic
//https://graph.facebook.com/me/friends?access_token={accessToken}&fields=name,id,picture

// sample code to get profile pic for any user, should send userId
// FB.api("/"+userId+"/picture",function(response){
// 	console.log(response);
// });