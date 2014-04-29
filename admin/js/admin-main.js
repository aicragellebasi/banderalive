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
	//console.log(nEvent);
	nEvent.set("title", data.eventTi);
	nEvent.set("text", data.eventTe);
	nEvent.set("imgFile", data.eventIm);

	//nEvent.set(name, file);

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
			$('#addEventEr').text("There was a problem saving the event: ");
			console.log(i);
		}
	});	
	
}


function listEvent(query){
	$('#accordionEvents').empty();
	query.find({
		success: function(results){
			//console.log('success retrieving the events');

			for (i=0;i<results.length;i++){

				var dataEvent = results[i];
				var toggleID = 'collapse-'+i;
				buildCollapsePanel(dataEvent, toggleID, query)

			}
		},
		error: function(error){
			console.log('error retrieving the events');
		}
	});	
}

function deleteEvent(e, panel, query){
	alert('are you sure you want to delete this event');
	e.destroy({
	  success: function(myObject) {
	    // The object was deleted from the Parse Cloud.
	    // panel.remove();
	    listEvent(query);
	  },
	  error: function(myObject, error) {
	    // The delete failed.
	    // error is a Parse.Error with an error code and description.
	    console.log('There was an error deleting the event');
	  }
	});
}


function buildCollapsePanel(data, collapseID, query){
	var panel = $('<div>').addClass('panel panel-default');

	//BUILDING THE HEADERS FOR THE COLLAPSIBLE PANELS
	var panelHeading = $('<div>').addClass('panel-heading');
	var panelActions = $('<span>').addClass('pull-right close').html('&times;');
	var panelH4 = $('<h4>').addClass('panel-title');
	var panelH4a = $('<a>').attr('data-toggle', 'collapse').attr('data-parent','#accordionEvents').attr('href','#'+collapseID).append(data.get('title'));

	panelH4.append(panelH4a);
	panelHeading.append(panelH4).append(panelActions);
	panel.append(panelHeading);

	//BUILDING THE CONTENT FOR THE COLLAPSIBLE PANELS
	var panelContent = $('<div>').addClass('panel-collapse collapse').attr('id',collapseID);
	var panelBody = $('<div>').addClass('panel-body').append(data.get('text'));

	panelContent.append(panelBody);
	panel.append(panelContent);

	// FINALLY APPEND ALL OF THE CONTENT TO EACH PANEL
	$('#accordionEvents').append(panel);

	//BINDING ACTIONS
	panelActions.on('click', function(){
		deleteEvent(data,panel, query);
	});
}


