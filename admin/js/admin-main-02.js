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

	nEvent.save(null, {
		success: function(e){
			console.log(e.id);
			console.log(e.get("title"));
			console.log(e.get("text"));
			$('#addEventEr').text("Thanks, your event has been saved.");
			setTimeout(function(){
				$('#addEventForm input').val('');
				//$('#addEventForm #addEventTe').val('');
				tinyMCE.activeEditor.setContent('');
				$('#addEventForm #addEventEr').empty();
				$('#addEventForm').modal('hide');
				
			},500);
		},
		error: function(e,i){
			$('#addEventEr').text("There was a problem saving the event: "+i.message);
			//console.log(i.message);
		}
	});	
}

function getImgFile(){
	var fileUploadControl = $("#addEventIm")[0];
	if (fileUploadControl.files.length > 0) {
	  var file = fileUploadControl.files[0];
	  var name = file.name;
	  var parseFile = new Parse.File(name, file);
	  return parseFile;
	} else {
		return false;
	}

}


function listEvent(query){
	$('#accordionEvents').empty();
	query.find({
		success: function(results){
			//console.log('success retrieving the events');
			for (i=0;i<results.length;i++){
				var dataEvent = results[i];
				var toggleID = 'collapse-'+i;
				buildCollapsePanel(dataEvent, toggleID, query);
			}
		},
		error: function(error){
			console.log('error retrieving the events');
		}
	});	
}

function deleteEvent(e, panel, query){
	//alert('are you sure you want to delete this event');
	/*
	var alertMd = alertBox('Attention', 'Are you sure you want to delete this event?', 'Yes, sure!', 'Noooo!');
	panel.after(alertMd);
	$("#alert").alert();
	*/
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
	var img = data.get('imgFile');
	var panelImg = $('<img>').attr('src', img.url()).addClass('col-sm-4 img-responsive');
	var panelContent = $('<div>').addClass('panel-collapse collapse').attr('id',collapseID);
	var panelBody = $('<div>').addClass('panel-body row').append(panelImg).append(data.get('text'));
	$('.panel-body p').addClass('col-8');

	panelContent.append(panelBody);
	panel.append(panelContent);

	// FINALLY APPEND ALL OF THE CONTENT TO EACH PANEL
	$('#accordionEvents').append(panel);

	//BINDING ACTIONS
	panelActions.on('click', function(){
		var actBt = $(this);
		actBt.hide();
		var alertMd = alertBox('Attention', 'Are you sure you want to delete'+data.get("title"), 'Yes, sure!', 'Noooo!', data, panel, query);
		panel.after(alertMd);
		$("#alert").alert().bind('closed.bs.alert', function () {
			  actBt.show();
		});
	});
}


function alertBox(title, msg, okButton, cancelButton, data, object, query){
	//var alertBox = $('#alert');
	var alertBox = $('<div>').addClass('alert alert-danger fade in').attr('id','alert');
	var ArrowBt = $('<button>').addClass('close').attr('type','button').attr('data-dismiss','alert').attr('aria-hidden','true').text('x');
	var alertTitle = $('<h4>').text(title);
	var alertMsg = $('<p>').text(msg);
	var okBt = $('<button>').attr('type','button').attr('id','okBt').addClass('btn btn-danger').text(okButton).on('click',function(){
		//alert('valid');
		//return true;
		deleteEvent(data, object, query);
	});
	var cancelBt = $('<button>').attr('type','button').attr('id','cancelBt').attr('data-dismiss','alert').addClass('btn btn-default').text(cancelButton);
	alertBox.append(ArrowBt).append(alertTitle).append(alertMsg).append(okBt).append(cancelBt);
	return alertBox;
}


