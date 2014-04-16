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


