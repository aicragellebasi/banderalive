function loggedIn(){
	$('#signinLi').hide();
	$('#signupLi').hide();
	$('#signoutLi').show();
	$('#addEventLi').show();
	$('#eventLi').show();
}

function notLoggedIn(){
	$('#signinLi').show();
	$('#signupLi').show();
	$('#signoutLi').hide();
	$('#addEventLi').hide();
	$('#eventLi').hide();
}

function signIn(){
	if($('#signinUs').val()==""){
      	$('#signinEr').text("Name is required");
      	$('#signinUs').addClass('focusedInput').focus();
    } else if ($('#signinPw').val()==""){
    	$('#signinEr').text("Password is required");
      	$('#signinPw').addClass('focusedInput').focus();
    } else {
    	Parse.User.logIn($('#signinUs').val(), $('#signinPw').val(), {
		  success: function(user) {
		    $('#signinUs').val("");
			$('#signinPw').val("");
			$('#signinForm').modal('hide');
			loggedIn();
		  },
		  error: function(user, error) {
		    console.log("There was an error signing in");
		  }
		});
    }
}

function signUp(){
	if($('#signupUs').val()==""){
      	$('#signupEr').text("Name is required");
      	$('#signupUs').addClass('focusedInput').focus();
    } else if ($('#signupPw').val()==""){
    	$('#signupEr').text("Password is required");
      	$('#signupPw').addClass('focusedInput').focus();
    } else if ($('#signupPw').val()!=$('#signupPwVe').val()) {
    	$('#signupEr').text("Password does not match");
      	$('#signupPwVe').addClass('focusedInput').focus();
    } else {
    	var user = new Parse.User();
		user.set("username", $('#signupUs').val());
		user.set("password", $('#signupPw').val());
		user.signUp(null, {
			success: function(u){
				$('#signupUs').val("");
				$('#signupPw').val("");
				$('#signupPwVe').val("");
				$('#signupForm').modal('hide');
				loggedIn();
			},
			error: function(u, e){
				console.log("There was an error signing up");
			}
		});
    }
}

function addEvent(nEvent, data){
	console.log(nEvent);
	nEvent.set("title", data.eventTi);
	nEvent.set("text", data.eventTe);

	nEvent.save(null, {
		success: function(e){
			console.log(e.id);
			console.log(e.get("title"));
			console.log(e.get("text"));
			$('#addEventEr').text("Thanks, your event has been saved.");
			setTimeout(function(){
				$('#addEventForm').modal('hide');
			},1000);
		},
		error: function(e,i){
			$('#addEventEr').text("There was a problem saving the event");
		}
	});	
	
}


function listEvent(query){
	query.find({
		success: function(results){
			//console.log('success retrieving the events');

			for (i=0;i<results.length;i++){

				var dataEvent = results[i];
				var toggleID = 'collapse-'+i;
				buildCollapsePanel(dataEvent, toggleID)

			}
		},
		error: function(error){
			console.log('error retrieving the events');
		}
	});	
}


function buildCollapsePanel(data, collapseID){
	var panel = $('<div>').addClass('panel panel-default');

	//BUILDING THE HEADERS FOR THE COLLAPSIBLE PANELS
	var panelHeading = $('<div>').addClass('panel-heading');
	var panelH4 = $('<h4>').addClass('panel-title');
	var panelH4a = $('<a>').attr('data-toggle', 'collapse').attr('data-parent','#accordion').attr('href','#'+collapseID).append(data.get('title'));

	panelH4.append(panelH4a);
	panelHeading.append(panelH4);
	panel.append(panelHeading);

	//BUILDING THE CONTENT FOR THE COLLAPSIBLE PANELS
	var panelContent = $('<div>').addClass('panel-collapse collapse').attr('id',collapseID);
	var panelBody = $('<div>').addClass('panel-body').append(data.get('text'));

	panelContent.append(panelBody);
	panel.append(panelContent);

	// FINALLY APPEND ALL OF THE CONTENT TO EACH PANEL
	$('#accordion').append(panel);
}

