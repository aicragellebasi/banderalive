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