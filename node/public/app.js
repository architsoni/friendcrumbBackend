var friendCrumbs={
	api : {
		fcManager : function(){
			var self = this;
			var apiDomain = "http://localhost:8080/";
			self.redirectAppId = {};
			this.registerClientUrl = function(url){
				//add url to db
				$.ajax({
				  type: "POST",
				  url: apiDomain + 'api/appUrls',
				  data: {
				  	redirect_url : url
				  },
				  success : function (res, status) {
				  	if(status == "success"){
				  		//self.redirectAppId[res.id] = redirect_url;
				  		self.redirectAppId = res._id;
				  	}
				  },
				  // error : function (res, req) {
				  // 	console.log(res);
				  // },
				});
			};
			this.checkFbLoginStatus = function(){
				 FB.getLoginStatus(function(response) {
		        	self.statusChangeCallback(response);
		    	});
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
			this.getProfileInfo = function(res){
				var userId = res.authResponse.userID; // for accessToken res.authResponse.accessToken
				// FB.api("/me/friends", function (response) {
				//       if (response && !response.error) {
				//         /* handle the result */
				//       }
				//     }
				// );
				// FB.api(
				//   '/',
				//   'GET',
				//   {"fields":"name,members"},
				//   function(response) {
				//       console.log(response);
				//   }
				// );
				// FB.api("/"+userId+"/picture",function(response){
				// 	console.log(response);
				// });
				add url to db
				$.ajax({
				  type: "GET",
				  url: apiDomain + 'api/appUrls/'+self.redirectAppId,
				  success : function (res, status) {
				  	if(status == "success"){
				  		//alert(res.redirect_url);
				  		window.location.href = res.redirect_url + "?fbSyncDone=true";
				  	}
				  },
				});
				
			};

		}
	}
};