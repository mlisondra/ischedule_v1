function goto_specific_month(month){
	var current_calendar_date = $('#mycalendar').fullCalendar('getDate');
	var current_calendar_year = current_calendar_date.getFullYear();
	$('#mycalendar').fullCalendar( 'gotoDate', current_calendar_year, month);
 }
		 
function get_contacts(){
	$.post('process.php',{"action":"get_contacts"},
		function(data){
				$('#contacts_list').html(data);
		}
	);
}

function show_modal(modal_type,obj_id){
	var obj_id = typeof(obj_id) != 'undefined' ? obj_id : 0;
	
	var modal_type = modal_type;
	var modal_content = "";
	var modal_title = "";
	var modal_height = 400;
	var modal_width = 500;
	
	switch(modal_type){
		case "add_contact":
			modal_title = "Add Contact";			
			break;
		case "edit_contact":
			modal_title = "Edit Contact";
			break;
		case "manage_contacts":
			modal_title = "Manage Contacts";
			break;
		case "add_category":
			modal_title = "Add Calendar";
			modal_height = 350;
			modal_width = 350;			
			break;
		case "edit_category": //Really editing a Calendar
			modal_title = "Edit Calendar";
			modal_height = 470;
			modal_width = 350;
			break;
		case "manage_categories":
			modal_title = "Manage Calendars";
			break;		
		case "faqs":
			modal_title = "FAQs";
			break;
		case "terms":
			modal_title = "Terms & Conditions";
			break;
		case "about":
			modal_title = "About";
			break;
		case "delete_selected_contacts":
			modal_title = "Delete selected contacts";
			obj_id = $('#contact_list_form').serialize();
			break;
		case "manage_contacts":
			modal_title = "Manage Contacts";
			break;
		case "add_event":
			modal_height = 450;
			modal_title = "Add Event";
			break;
		case "edit_event":
			modal_height = 450;
			modal_title = "Edit Event";
			break;
		case "manage_events":
			modal_title = "Manage Events";
			break;
		case "my_account":
			modal_title = "Your Account Details";
			break;
		case "bulk_add":
			modal_title = "Add Contacts";
			break;
	}
	
	post_data = "action=get_modal_content&modal_type=" + modal_type + "&obj_id=" + obj_id;
	var modal_content = $.post('../schedule/process.php',post_data,
		function(data){
			$("#modal_container").html(data);
			if(modal_type == "add_event" || modal_type == "edit_event"){
				var cdt = new Date();
				var current_month = cdt.getMonth() + 1;
				if(current_month < 10){
					current_month = "0" + current_month;
				}
				var current_day = cdt.getDate();
				var current_year = cdt.getFullYear();
				var today_date = current_month + "/" + current_day + "/" + current_year;
				if(modal_type == "add_event"){
					$("#begin_date").val(today_date); //apply today date to begin date picker only for Add Event
				}
				var dates = $( "#begin_date, #end_date" ).datepicker({	
							minDate : today_date,
							numberOfMonths:1,
							onSelect: function( selectedDate ) {
								var option = this.id == "begin_date" ? "minDate" : "maxDate",
									instance = $( this ).data( "datepicker" ),
									date = $.datepicker.parseDate(
										instance.settings.dateFormat ||
										$.datepicker._defaults.dateFormat,
										selectedDate, instance.settings );
								dates.not( this ).datepicker( "option", option, date );
								$("#end_date").val(selectedDate);
							}						
						});
				
				$('#begin_time').timepicker({
						showLeadingZero : false,
						showPeriod : true,
						amPmText: ['AM', 'PM'],
						onSelect : function(time,inst){
								$('#end_time').val(time);
							}
				});
				
				$('#end_time').timepicker({
					showLeadingZero : false,
					showPeriod : true,
					amPmText: ['AM', 'PM']
				});								
			}
		}
	);	

	$('#modal_container').dialog({
		autoOpen: true,
		resizable: false,
		width: modal_width,
		height: modal_height,
		draggable: false,
		buttons: {
			"Save": function() {
				switch(modal_type){
					case "add_contact":
						validate_add_contact();
						get_contacts();
						break;
					case "edit_contact":
						validate_edit_contact();
						get_contacts();
						break;
					case "manage_contacts":
						validate_delete_contact();
						get_contacts();
						break;
					case "add_category":
						validate_add_category();
						get_categories();
						get_contacts();
						break;
					case "edit_category":
						validate_edit_category();
						get_categories();
						get_contacts();
						break;
					case "delete_selected_contacts":
						delete_selected_contacts();
						break;
					case "my_account":
						validate_my_account();
						break;
					case "add_event":
						validate_add_event();
						get_user_events();
						break;
					case "edit_event":
						validate_edit_event();
						break;
					case "manage_categories":
						validate_delete_category();
						get_contacts();
						refresh_calendar();
						break;
					case "manage_contacts":
						validate_delete_contact();
						break;
					case "manage_events":
						validate_delete_event();
						break;
					case "bulk_add":
						bulk_add(); //from validate.js
						break;
				}
				
			}, 
			"Cancel": function() {
				$(this).dialog("destroy");
			}				
		},
		modal: true,
		title: modal_title,
		open: function(event, ui) { $('#modal_container').html(""); }
	});
	
}


function get_categories(){
	//alert('get categories');
	$.post('process.php',{"action":"get_categories"},
		function(data){
				$('#category_list').html(data);
		}
	);
}

function get_user_events(){
	$.post('process.php',{"action":"get_user_events"},
		function(data){
				$('#events_list').html(data);
		}
	);
}

function delete_contact(){
	//iterate through checkboxes
}

function add_event(date_obj){
	show_modal('add_event','');
}

function show_static_modal(modal_type){
	var modal_type = modal_type;
	var modal_content = "";
	var modal_title = "";
	switch(modal_type){
		case "faqs":
			modal_title = "FAQs";
			break;
		case "terms":
			modal_title = "Terms & Conditions";
			break;
		case "about":
			modal_title = "About";
			break;
	}

	$.post('../schedule/process.php',{"action":"get_static_modal_content","modal_type":modal_type},
		function(data){
			$("#static_modal_container").html(data);
		}
	);	
	
	$('#static_modal_container').dialog({
		autoOpen: true,
		width: 600,
		height: 400,
		modal: true,
		title: modal_title
	});
}

function refresh_calendar(){
	$('#mycalendar').fullCalendar('refetchEvents');
}

$("#logout").click(function(){
	if(confirm("Are you sure you want to logout?")){
		window.location.href="../logout/";
	}else{
		return false;
	}
});

function expand_events(elem){
	if(document.getElementById(elem).style.display == "none"){
		$("#"+elem).show();
	}else{
		$("#"+elem).hide();
	}	
}

function remove_manager(manager,calendar){
	var manager_id = manager;
	var calendar_id = calendar;
	var post = "action=remove_manager&manager_id=" + manager_id + "&calendar_id=" + calendar_id;
	$.post("../schedule/process.php",post,
		function(data){
			$.post("../schedule/process.php",{action:"get_calendar_managers","calendar_id":calendar_id},
				function(data){
					$("#calendar_managers").html(data);
				}
			);
		}
	);
}

$("#reminder_notification_all").live("click",(function(){
	var checked_status = this.checked;
	$("#add_event_form input:checkbox").each(function()
	{
		this.checked = checked_status;
	});
}));

/**
 * Bind delete category
 */
$('.delete_category').live('click',function(){
	obj_id = $(this).attr("id");
	$('.alert_modal p').html('Are you sure you want to delete the Calendar? Doing so will delete all associated events.');
	$('.alert_modal #obj_id').val(obj_id);
	open_alert_modal();
});

$(".edit_category").click(function(){
	
});

function open_alert_modal(){
	$('.alert_modal').dialog('open');	
}

function close_alert_modal(){
	$('.alert_modal').dialog('close');	
}

function update_category_list_modal(){
	post_data = "action=get_modal_content&modal_type=manage_categories";
	$.post('../schedule/process.php',post_data,
		function(data){
			$('#modal_container').html(data);
		}
	);	
}

$(document).ready(function(){
	$("#add_contact_button").click(function(){
		$.post("../schedule/process.php",{action:"verify_account"},function(data){
			alert(data);
		});
	});
	
    //Setup Alert Modal
     $('.alert_modal').dialog({
		modal: true,
		closeOnEscape: false,
		hide : 'fade',
		autoOpen: false,
		resizable: false,
		draggable: false,
		minWidth: 300,
		title : "Please confirm"
	}); 
	
	$('.alert_modal .btn').click(function(){
		if($(this).attr('id') == 'yes'){
			$.post('../schedule/process.php',{"action":"delete_associated_events","category_id":obj_id},
				function(data){
					if(data.status == 'success'){
						$('.alert_modal	').dialog('The Calendar has been removed');	
						open_alert_modal();
						setTimeout(close_alert_modal,1500);
						refresh_calendar();
						get_categories();
						update_category_list_modal();
					}
				},'json'
			);
		}else{
			close_alert_modal();
		}
	});
	
});	
