//import * as server_connection from './server_connection.js';

var divs = new Array("DASHBOARD", "ALERTAS"); //Array with the divs id that we want to show and hide
var selected_alerts = []; //Array were we save the selected alerts


/**
 * On load the DOOM, we load the alerts and the dashboard.
 */
window.addEventListener('DOMContentLoaded', event => {
    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
            document.body.classList.toggle('sb-sidenav-toggled');
        }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

    //Default filter shoud bee 1 day ago
    $("#FilterByTime").change(function () {
        var filter_time = $("#FilterByTime").val();
        console.log("Filter by time --> ", filter_time);
        if (filter_time === 0) { // There are no filters 
            loadAlerts(); 
        } else { // Show time range. (1 day, 2 day, .. , 30 day)
            loadAlertsFilteredByTime($("#FilterByTime").val());
        }
    });
});


/**
 * This function is the first time that we load the alerts.
 */
function load_alerts_first_time() {
    loadAlertsFilteredByTime($("#FilterByTime").val());
}


/**
 * Create table of alerts.
 * 
 * Create a data table with the alerts that we want to show.
 * 
 * @param {Array} alerts_to_show array of alerts to show. 
 */
function showAlerts(alerts_to_show) {
    console.log("alerts_to_show --> type ", typeof (alerts_to_show));
    if (alerts_to_show.length <= 0 || alerts_to_show === null) {
        console.log("No se han encontrado alertas");
        //Cargar alguna imagen donde no se han encontrado alertas
        //exit();
    }

    var div = document.getElementById("maciaAlertas");
    div.innerHTML = '' //Para que siempre se actualize y no queden restos de la tabla anterior

    var content = '<div class="card mb-4"><div class="card-header"><i class="fas fa-table me-1"></i>Alerts</div><div id="alertas" class="card-body"><table id="table_alerts" class="table table-striped table-dark">'; // Creamos la targeta con las alertas
    content += '<thead><tr><th scope=\"col\">Actions</th> <th scope=\"col\">Time</th><th scope=\"col\">Title</th><th scope=\"col\">Status</th><th scope=\"col\">Urgency</th><th scope=\"col\">Action</th><th scope=\"col\">Index</th><th scope=\"col\">Comment</th><th scope=\"col\">Owner</th></tr></thead>';
    content += '<tbody>';
    for (var i = 0; i < alerts_to_show.length; i++) {
        var obj = alerts_to_show[i];
        var aux = 0
        var aux_id = '';
        for (var key in obj) {
            var value = obj[key];
            if (aux == 0) { // idAlert	
                aux_id = value;
                content += '<tr id=\"' + value + '\"><td style="min-width:150px;"><div><input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"flexCheckIndeterminate\" onclick=\"selectAlert(this,\'' + value + '\')\" ><button type=\"button\" class=\"btn btn-primary\" style=\"margin-left:5px;\"  onclick=\"showHideRow(\'' + value + '\')\" ><i class=\"far fa-eye\" width=\"10\" height=\"10\"></i></button><button type=\"button\" class=\"btn btn-primary\" style=\"margin-left:5px;\"  data-toggle=\"modal\" onclick=\"quickEdit(this)\"  data-target=\"#EditAlert\"><i class=\"fas fa-edit\" width=\"10\" height=\"10\"></i></button> </div></td>';
                aux = aux + 1;
            } else {
                content += '<td><p>' + value + '</p></td>';
                aux = aux + 1; //Para crear un child 
            }
        }
    }
    content += '</tbody>';
    content += '</table></div></div>';
    div.innerHTML += content;
    $(document).ready(function () {
        var table = $('#table_alerts').DataTable(); //Set datatable object

    });

    // Channge the length(Menu) of the table
    $('#table_alerts').DataTable({ 
        "lengthMenu": [10, 20, 40, 100]
    });
}


/**
 * This function is used to show the events that have caused the alert
 * 
 * This function creates a mini table with the event. This table is insert on
 * the father row (This is Alert row). Also there is string treatment to make
 * it look better in the table.
 * 
 * @param {JSON} data  This is the data that we want to show, this is the event.
 * @param {html element} div  This is the div where we want to show the data.
 */
function viewEventAlert(data, div) {
    var content = '';
    content = '<tr><table><tbody><tr>';
    var events = JSON.parse(data);
    var raw = '';
    for (var i = 0; i < events.length; i++) {
        var obj = events[i];
        content += '<td colspan="3">';
        for (var key in obj) {
            if (obj[key] != null) {
                if (obj[key].length != 1) {
                    if (key.split("fields_").pop() === "_raw") {
                        var p = obj[key].replaceAll("<", "&lt;"); //
                        p.replaceAll(">", "&gt;");
                        raw += '<td colspan="5"><b style="color:#B77E42;"> - Raw</b>\t<br><div>' + p + '</div></td>';
                    } else {
                        var etiqueta = key.split("fields_").pop();
                        //Replace all _ for " "
                        etiqueta = etiqueta.replaceAll("_", " ");
                        //Put the first letter in uppercase
                        etiqueta = etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
                        content += '<li> <span style="color:#B77E42">' + etiqueta + '</span> : ' + obj[key] + '</li>';
                    }
                }
            }
        }
        content += '</td>' + raw;
        content += '</td>';
    }
    content += '</tr></tbody></table></tr>';
    var table = $('#table_alerts').DataTable();
    var row = table.row('#' + div);
    row.child(content).show();
}


/**
 * Show and hide an event of an alert
 * 
 * This function is used to show and hide the event of an alert. If the event is
 * shown, it will be hidden. If the event is hidden, it will be shown.
 * All incident_id are unique, so we can use it to identify the row.
 * 
 * @param {string} incident_id is the id of the alert.
 *  */
function showHideRow(incident_id) {
    var table = $('#table_alerts').DataTable();
    var row = table.row('#' + incident_id);
    if (row.child.isShown()) {
        row.child.hide();
    } else {
        loadEvent(incident_id);
    }
}


/**
 * Select an alert for edit.
 * 
 * This function is used to select an alert for edit. When an alert is selected
 * this id is stored on the array selected_alerts. This array is used to know
 * which alerts are selected.
 * It is important to know that the user can press different buttons, and can
 * select the same alert several times. So, we have to check if the alert is
 * already selected. If it is, we don't have to select it again.
 * 
 * @param {string} id_alert is the id of the alert.
 * */
function selectNewAlert(id_alert) {
    var isSelected = false;
    //Comprovar que no haya estado seleccionada antes
    for (var i = 0; i < selected_alerts.length && !isSelected; i++) {
        if (selected_alerts[i] == id_alert) {
            isSelected = true;
        }
    }
    //Si la alerta no estaba seleccionada, la seleccionamos
    if (!isSelected) {
        selected_alerts.push(id_alert);
    }
}


/**
 * When we are editing an alert, we must have the changes.
 * 
 * The user make all changes to the GUI, and then we send this new info 
 * to the server using the updateAlert function.
 * 
 */
function getChanges() {
    //select status
    var status_ = document.getElementById("selectStatus");
    var status_value = status_.value;
    var status_selected = status_.options[status_.selectedIndex].text;
    //select owner
    var owner = document.getElementById("selectOwner");
    var owner_value = owner.value;
    var owner_selected = owner.options[owner.selectedIndex].text;
    //select comment
    var comment = document.getElementById("selectComment").value;
    updateAlert(selected_alerts, owner_selected, comment, status_selected);
    endEdit();
}


/**
 * Reset the seleceted alerts.
 * 
 * When we finish editing, we have to reset the selected alerts. 
 * Alse we unselectec the alerts in the GUI.
 * 
 */
function endEdit() {
    //Deseleccionamos de manera visual todas las alertas
    alerts = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].checked = false;
    }
    selected_alerts = [];
    console.log(selected_alerts);
}


/**
 * Edit faster a single alert on the GUI.  
 * 
 * Unselect all alerts and select the alert that we want to edit.
 * 
 * @param {html element} el with this element, we can get the id of the alert.
 * */
function quickEdit(el) {
    cleanAll(); //Unselect all alerts
    selectNewAlert(el.parentElement.parentElement.parentElement.id);
}


/**
 * This function is used to edit all alerts that are selected.
 * 
 * @param {type} button
 * */
function EditAll(button) {
    selectAll(); //Select all alerts
    EditSelected(button);  //Edit all alerts
}


/**
 * Select all alerts that are shown on the screen.
 * */
function selectAll() {
    alerts = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].checked = true;
        selectNewAlert(alerts[i].parentElement.parentElement.parentElement.id)
    }
}


/**
 * This function is used to select or unselect an alert.
 * 
 * When an alert is selected, this id is stored on the array selected_alerts.
 * Also, if the alert is unselected, we have to remove it from the array.
 * 
 * @param {*} val indicate if the alert was selected or not.
 * @param {*} idAlert identify the alert.
 */
function selectAlert(val, idAlert) {
    if (val.checked) {
        //Añadimos la alerta
        selectNewAlert(idAlert)
        console.log(selected_alerts);
    } else {
        //Quitamos la alerta
        aux = [];
        for (var i = 0; i < selected_alerts.length; i++) {
            if (selected_alerts[i].localeCompare(idAlert) != 0) {
                aux.push(selected_alerts[i]);
            }

        }
        selected_alerts = aux;
        console.log(selected_alerts);
    }
}


/**
 * Unselect all alerts.
 * 
 * */
function cleanAll() {
    alerts = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].checked = false;
    }
    selected_alerts = []; // Borramos todas las alertas seleccionadas.
    console.log(selected_alerts);
}


/**
 * Filter the alerts by all filters.
 * 
 * Get all the values of the filters and send them to the server. The server
 * will return the alerts that match with the filters, and we show this alerts.
 * */
function filterByAllFilters() {
    var index = document.getElementById("FilterIndex").value;
    var urgency = document.getElementById("FilterUrgency").value;
    var status_ = document.getElementById("FilterStatus").value;
    var owner = document.getElementById("FilterOwner").value;

    var data1 = document.getElementById("data1").value;
    var data2 = document.getElementById("data2").value;
    var time1 = document.getElementById("time1").value;
    var time2 = document.getElementById("time2").value;

    var query = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        data: {

            dat: "getAlertsByAllFilters", index: index, urgency: urgency, status_: status_, owner: owner,
            time1: time1, time2: time2, data1: data1, data2: data2
        },
        success: function (data) {
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Show all users on the GUI.
 * 
 * @param {Array} users 
 */
function showUsers(users) {
    var content = '<option selected>All</option>';
    for (var i = 0; i < users.length; i++) {
        var obj = users[i];
        for (var key in obj) {
            var value = obj[key];
            content += '<option>' + value + '</option>';
        }
    }
    document.getElementById('FilterOwner').innerHTML = content;
}


/**
 * Show all clients on the GUI.
 * 
 * @param {Array} clients All name clients.
 * */
function showClients(clients) {
    const json = JSON.parse(clients);
    var content = '<option selected>All</option>';
    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        for (var key in obj) {
            var value = obj[key];
            //console.log("valor "+ value);
            content += '<option>' + value + '</option>';
        }
    }
    document.getElementById('FilterIndex').innerHTML = content;
}


/**
 * Reset all filters.
 * 
 * Put all filters to default value.
 */
function resetFilters() {
    document.getElementById("FilterUrgency").value = 'All';
    document.getElementById("FilterIndex").value = 'All';
    document.getElementById("FilterStatus").value = 'All';
    document.getElementById("FilterOwner").value = 'All';
    document.getElementById("data1").value = null;
    document.getElementById("data2").value = null;
    document.getElementById("time1").value = null;
    document.getElementById("time2").value = null;
    loadAlerts();
}


/**
 * Hide all divs and show only one div.
 * 
 * This function is used to show only one div at the same time. This is used
 * to show the divs of the menu. (Web App).
 * 
 * @param {HTML element} divToShow 
 */
function ocultarTodosDivsYMostrar1(divToShow) {
    for (var i = 0; i < divs.length; i++) {
        if (divs[i] === divToShow) {
            document.getElementById(divToShow).style.display = "block";
            if (divs[i] == "ALERTAS") {
                // Load all alerts.
                loadClients();
                loadUsers();
                load_alerts_first_time();
            }
        } else {
            // Hide all divs.
            document.getElementById(divs[i]).style.display = "none";
        }
    }
}


/**
 * Show user, what alerts are editing.
 */
function show_user_what_alerts_are_editing() {
    //Show alerts selectets
    var content = "<label>You are editing <span style='color:red;'>" + selected_alerts.length + "</span> alerts </label>";
    //Show title alerts.
    //Para obtener todo el titulos de las alertas seleccionadas, lo puedes hacer con una array y guardas los titulos
    // o con una petición Ajax al servidor
    //server_connection.load_All_Titles();
    $("#info_editing").html(content);
}


/**
 * Edit selected alerts.
 * 
 * If there are alerts selected, we can edit them. If not, we can't edit any alert.
 * 
 * @param {*} button Click on this button.
 */
function EditSelected(button) {
    if (selected_alerts.length != 0) {
        //Se pueden editar alertas
        button.dataset.target = "#EditAlert";
        show_user_what_alerts_are_editing();
    } else {
        //No se puede editar ninguna alerta ya que no hay ninguna seleccionada
        alert("No hay alertas seleccionadas");
    }
}

//_______________________________________________________________________________________
// All this functions that are above, must be in the file "functions.js".
// You can use Babel or TypeScript to link this two files.
//_______________________________________________________________________________________

/**
 * Is used to load all title alerts.
 * 
 * Is not supported on the backend yet.
 * 
 * @param {*} alerts_id id of the alerts.
 */
function load_All_Titles(alerts_id) {
    jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        dataType: "json",
        data: {
            dat: "getAlertsByOneDayRange"
        },
        success: function (data) {
            console.log("Nuevo ficheroooo --> ", data);
            return data;
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Load all clients.
 * 
 * Clients are the same as index (on database).
 * 
 * */
function loadClients() {
    var clients = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            dat: "getAllClients"
        },
        success: function (data) {
            showClients(data);
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Load all users.
 */
function loadUsers() {
    var users = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            dat: "getAllUsr"
        },
        success: function (data) {
            showUsers(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Load all alerts.
 * 
 * Get the index selected on the gui and load all alerts of that index.
 */
function filterByClient() {
    var index = document.getElementById("FilterIndex").value;
    var events = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            dat: "getAlertsByClient", index: index
        },
        success: function (data) {
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Update alerts.
 * 
 * This function is used to update alerts. It is used to update the status, owner and comment of the alerts.
 * 
 * @param {Array{String}} alerts_ incident_id of the alerts.
 * @param {*} owner   owner of the alerts.
 * @param {*} comment  comment of the alerts.
 * @param {*} status_  status of the alerts.
 */
function updateAlert(alerts_, owner, comment, status_) {
    var update = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        data: {
            dat: "updateAlertas", incident_id: alerts_, comment: comment, status_: status_, owner: owner
        },
        success: function (data) {
            //Cuando se ha realizado el update, tenemos que recargar el div de las alertas
            //Se limpian las alertas seleccionadas, se cierra la ventana emergente, se vuelve a cargar el mismo div con las alertas actualizadas
            endEdit();
            document.getElementById("closeEdit").click(); //Close window
            ocultarTodosDivsYMostrar1('ALERTAS'); // Reload the div
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Filter alerts by status.
 * 
 * Get the status selected on the gui and load all alerts of that status.
 * */
function filterByStatus() {
    var status_ = document.getElementById("FilterStatus").value;
    status_ = status_.toLowerCase();

    var alertas = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        data: {
            dat: "getAlertsByStatus", status_: status_
        },
        success: function (data) {
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Filter alerts by owner.
 * 
 * Get the owner selected on the gui and load all alerts of that owner.
 */
function filterByOwner() {
    var owner = document.getElementById("FilterOwner").value;
    var alertas = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        data: {
            dat: "getAlertsByOwner", owner: owner
        },
        success: function (data) {
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Filter alerts by urgency.
 * 
 * Get the urgency selected on the gui and load all alerts of that urgency.
 * */
function filterByUrgency() {
    var urgency = document.getElementById("FilterUrgency").value;
    urgency = urgency.toLowerCase();
    var alertas = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        data: {
            dat: "getAlertsByUrgency", urgency: urgency
        },
        success: function (data) {
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Load an event of an alert.
 * 
 * @param {String} incident id of the alert.
 */
function loadEvent(incident) {
    var events = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        data: {
            dat: "getEvents", incident_id: incident
        },
        success: function (data) {
            viewEventAlert(data, (incident));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Load all alerts.
 * 
 */
function loadAlerts() {
    var alertas = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        dataType: "json",
        data: {
            dat: "getAlerts"
        },
        success: function (data) {
            showAlerts(data);
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


/**
 * Filter alert by day Range. (Like Splunk).
 * 
 * Load the day range selected on the gui and load all alerts of that day range.
 * @param {String} dayRange
 * */
function loadAlertsFilteredByTime(dayRange) {
    var alertas = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        dataType: "json",
        data: {
            dat: "getAlertsByOneDayRange", day: dayRange
        },
        success: function (data) {
            //console.log("JAVASCRIPT --> ", data);
            showAlerts(data);
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}