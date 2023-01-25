//import * as server_connection from './server_connection.js';

var divs = new Array("DASHBOARD", "ALERTAS"); //Variable donde guardamos los divs que ocultamos y mostramos.
var selected_alerts = []; //Variable donde editamos las Alertas seleccionadas.

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
        //var m = parseInt($("#FilterByTime").val());
        var filter_time = $("#FilterByTime").val();
        console.log("Filter by time --> ", filter_time);
        if (filter_time === 0) { // There are no filters 
            loadAlerts();
        } else { // Show time range. (1 day, 2 day, .. , 30 day)
            loadAlertsFilteredByTime($("#FilterByTime").val());
        }
    });
});


function load_alerts_first_time() {
    //var filter_time = $("#FilterByTime").val();
    loadAlertsFilteredByTime($("#FilterByTime").val());
}

function loadAlertsFilteredByTime(dayRange) {
    console.log("dayRange --> ", dayRange, " type --> ", typeof (dayRange));
    var alertas = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        dataType: "json",
        data: {
            dat: "getAlertsByOneDayRange", day: dayRange
        },
        success: function (data) {
            console.log("JAVASCRIPT --> ", data);
            showAlerts(data);
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


function showAlerts(alerts_to_show) {
    console.log("alerts_to_show --> type ", typeof (alerts_to_show));
    if (alerts_to_show.length <= 0 || alerts_to_show === null) {
        console.log("No se han encontrado alertas");
    }

    var div = document.getElementById("maciaAlertas");
    div.innerHTML = '' //Para que siempre se actualize y no queden restos de la tabla anterior

    var content = '<div class="card mb-4"><div class="card-header"><i class="fas fa-table me-1"></i>Alerts</div><div id="alertas" class="card-body"><table id="table_alerts" class="table table-striped table-dark">'; // Creamos la targeta con las alertas

    //añadimos los botones
    //content += '<div class=\"row\" style=\"margin: 1em;\"><div class=\"col\"><button type=\"button\" id=\"EditSelected\" class=\"btn btn-success\" data-toggle=\"modal\" style=\'width:120px\' onclick=\"EditSelected(this)\">Edit Selected</button></div><div class=\"col\"><button type=\"button\" class=\"btn btn-success\" style=\'width:120px\' data-toggle=\"modal\" onclick=\"EditAll(this)\">Edit All</button></div><div class=\"col\"><button type=\"button\" class=\"btn btn-success\" style=\'width:120px\' onclick=\"selectAll()\">Select All</button></div><div class=\"col\"><button type=\"button\" class=\"btn btn-success\" style=\'width:120px\' onclick=\"cleanAll()\">Clean All</button></div><div class=\"col\"><button type=\"button\" class=\"btn btn-success\" style=\'width:150px\' onclick=\"\">Create Incident</button></div></div>';

    content += '<thead><tr><th scope=\"col\">Actions</th> <th scope=\"col\">Time</th><th scope=\"col\">Title</th><th scope=\"col\">Status</th><th scope=\"col\">Urgency</th><th scope=\"col\">Action</th><th scope=\"col\">Index</th><th scope=\"col\">Comment</th><th scope=\"col\">Owner</th></tr></thead>';

    //Afegim les alertes
    //console.log(typeof (alerts_to_show));

    content += '<tbody>';
    for (var i = 0; i < alerts_to_show.length; i++) {
        var obj = alerts_to_show[i];
        var aux = 0
        var aux_id = '';
        for (var key in obj) {
            var value = obj[key];
            if (aux == 0) {//idAlert	
                aux_id = value;
                content += '<tr id=\"' + value + '\"><td style="min-width:150px;"><div><input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"flexCheckIndeterminate\" onclick=\"selectAlert(this,\'' + value + '\')\" ><button type=\"button\" class=\"btn btn-primary\" style=\"margin-left:5px;\"  onclick=\"showHideRow(\'' + value + '\')\" ><i class=\"far fa-eye\" width=\"10\" height=\"10\"></i></button><button type=\"button\" class=\"btn btn-primary\" style=\"margin-left:5px;\"  data-toggle=\"modal\" onclick=\"quickEdit(this)\"  data-target=\"#EditAlert\"><i class=\"fas fa-edit\" width=\"10\" height=\"10\"></i></button> </div></td>';
                aux = aux + 1;
            } else {
                content += '<td><p>' + value + '</p></td>';
                aux = aux + 1; //Para crear un child 
            }
        }
        //content+='<tr id=\"hidden_row_'+aux_id+'\" class=\"hidden_row\" style=\"display: none;\"> <td colspan=4> INFORMACION DE LA ALERTA !!!!!!!!!!!!!</td></tr></tr>';
        //content += '<tr id=\"hidden_row_' + aux_id + '\" class=\"hidden_row\" style=\"display: none;\"> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td> </tr></tr>';
        //content += '<tr id=\"hidden_row_' + aux_id + '\" class=\"hidden_row\" > <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td> </tr></tr>';
    }
    content += '</tbody>';
    content += '</table></div></div>';
    div.innerHTML += content;
    $(document).ready(function () {
        var table = $('#table_alerts').DataTable(); //Le decimos que es un objeto DataTable

    });

    $('#table_alerts').DataTable({
        "lengthMenu": [10, 20, 40, 100]
    });
}



function loadAlerts() {
    //var alertas=null;	
    var alertas = jQuery.ajax({
        //type: "POST",
        type: 'POST',
        //url: './php/connect.php',
        url: './Back-End/reciver.php',
        dataType: "json",
        data: {
            dat: "getAlerts"
        },
        success: function (data) {
            showAlerts(data);
            //return data;
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


function viewEventAlert(data, div) {
    var content = '';
    content = '<tr><table><tbody><tr>';
    //content = '<tr><table><th><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></th><tbody><tr>';
    //content = '<tr><table><tbody><tr></tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><tr>';
    //console.log("dades a mostrar " + typeof (data));
    //console.log("dataaa :\n"+ data); 
    var events = JSON.parse(data);
    //console.log(typeof (events));
    //console.log("eventssss :\n"+ events);
    var raw = '';
    for (var i = 0; i < events.length; i++) {
        //console.log("i=", i, " events.length=", events.length)
        var obj = events[i];
        //console.log(obj);
        //content += '<th colspan="4">';
        content += '<td colspan="3">';
        for (var key in obj) {
            //console.log();
            if (obj[key] != null) {
                if (obj[key].length != 1) {
                    if (key.split("fields_").pop() === "_raw") {
                        var p = obj[key].replaceAll("<", "&lt;");
                        p.replaceAll(">", "&gt;");
                        raw += '<td colspan="5"><b style="color:#B77E42;"> - Raw</b>\t<br><div>' + p + '</div></td>';
                        //raw += '<td><b style="color:#B77E42;"> - Raw</b>\t<br><div>' + p + '</div></td>';
                    } else {
                        //limpiamos "fields_" de los eventos para que se vea mejor
                        var etiqueta = key.split("fields_").pop();
                        //Remplazamos todos los _ por " "	
                        etiqueta = etiqueta.replaceAll("_", " ");
                        //Ponemos letra mayúscula solo a la primera letra
                        etiqueta = etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
                        content += '<li> <span style="color:#B77E42">' + etiqueta + '</span> : ' + obj[key] + '</li>';
                    }
                }
            }
        }
        content += '</td>' + raw;
        //content += '</th>';
        content += '</td>';
    }

    content += '</tr></tbody></table></tr>';

    console.log(content);
    var table = $('#table_alerts').DataTable();
    var row = table.row('#' + div);
    row.child(content).show();
}


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


/*
 * Si el evento se está mostrando, hay que ocultar ese row.
 *
 * Si el evento no se está mostrando, hay que hacer una query 
 * a la base de datos para mostrar el evento.
 * 
 * */
function showHideRow(incident_id) {
    var table = $('#table_alerts').DataTable();
    var row = table.row('#' + incident_id);
    if (row.child.isShown()) {
        row.child.hide();
    } else {
        loadEvent(incident_id);
    }
}


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


function updateAlert(alerts_, owner, comment, status_) {
    console.log("alerts_ --> ", alerts_)
    var update = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            //dat: "updateAlertas", owner:owner, comment:comment, status_:status_
            dat: "updateAlertas", incident_id: alerts_, comment: comment, status_: status_, owner: owner
            //update_alerta($incident_id, $comment, $status, $owner)
        },
        success: function (data) {
            //Cuando se ha realizado el update, tenemos que recargar el div de las alertas
            //Se limpian las alertas seleccionadas, se cierra la ventana emergente, se vuelve a cargar el mismo div con las alertas actualizadas
            endEdit();
            document.getElementById("closeEdit").click(); //Cerramos ventana emergente
            ocultarTodosDivsYMostrar1('ALERTAS'); //recargamos el div
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
    //console.log("update returns-->",update);
}


//Reset all alerts
function endEdit() {
    //Deseleccionamos de manera visual todas las alertas
    alerts = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].checked = false;
    }
    selected_alerts = [];
    console.log(selected_alerts);
}


function quickEdit(el) {
    //Desseleccionamos más alertas si habian alguna ya seleccionada
    cleanAll();

    selectNewAlert(el.parentElement.parentElement.parentElement.id);
    console.log(selected_alerts);
}

function EditAll(button) {
    selectAll(); //Select all alerts
    EditSelected(button);  //Edit all alerts
}

//selectAll:
//Select all alerts that is show on the screen
function selectAll() {
    //console.log("Select All");
    alerts = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].checked = true;
        selectNewAlert(alerts[i].parentElement.parentElement.parentElement.id)
    }
    console.log(selected_alerts);
}

//selectAlert:
//param: - val. Indica si la alerta estaba seleccionada o no.
//       - idAlert. Nombre identificatico de esta alerta.
//Cada vez que el usuario clicke el boton de seleccionado, se guardará esta row.
//Si esta ya estaba seleccionada, se deseleccionara y se guardaran los cambios en 
//select_alerts.
function selectAlert(val, idAlert) {
    //console.log("Valor", val.checked);
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

//Deselecionamos todas las alertas.
function cleanAll() {
    alerts = document.getElementsByClassName("form-check-input");
    for (var i = 0; i < alerts.length; i++) {
        alerts[i].checked = false;
    }

    selected_alerts = []; // Borramos todas las alertas seleccionadas.
    console.log(selected_alerts);
}


function filterByAllFilters() {
    var index = document.getElementById("FilterIndex").value;
    var urgency = document.getElementById("FilterUrgency").value;
    var status_ = document.getElementById("FilterStatus").value;
    var owner = document.getElementById("FilterOwner").value;

    var data1 = document.getElementById("data1").value;
    var data2 = document.getElementById("data2").value;
    var time1 = document.getElementById("time1").value;
    var time2 = document.getElementById("time2").value;
    //console.log("Index :",index, " urgency :",urgency, " status :",status_, " owner :",owner );  
    //console.log("data1 --> ", data1,"\ndata2 --> ",data2, "\ntime1 --> ", time1, "\ntime2 --> ", time2);

    var query = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {

            dat: "getAlertsByAllFilters", index: index, urgency: urgency, status_: status_, owner: owner,
            time1: time1, time2: time2, data1: data1, data2: data2
        },
        success: function (data) {
            //console.log(data);	
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


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


function showUsers(users) {
    var content = '<option selected>All</option>';
    for (var i = 0; i < users.length; i++) {
        var obj = users[i];
        for (var key in obj) {
            var value = obj[key];
            //console.log("valor "+ value);
            content += '<option>' + value + '</option>';
        }
    }
    document.getElementById('FilterOwner').innerHTML = content;
}


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
    //console.log("content --> ", content);
}


//clients === index
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


//ocultarTodosDivsYMostrar1: 
//  param: divToShow    --> id= "divToShow"
//Ocultamos todos los divs y solo mostramos el idDivs que entra por parametro
function ocultarTodosDivsYMostrar1(divToShow) {
    for (var i = 0; i < divs.length; i++) {
        if (divs[i] === divToShow) {
            //mostramos este divs
            //console.log("Mostramos div: ", divToShow);
            document.getElementById(divToShow).style.display = "block";
            if (divs[i] == "ALERTAS") { //Cargamos todas las alertas
                //loadAlerts(); //MACIA
                //load_alerts_first_time();
                loadClients();
                loadUsers();
                load_alerts_first_time();
            }
        } else {
            //ocultamos el divs
            //console.log("Ocultamos div: " + divs[i]);
            document.getElementById(divs[i]).style.display = "none";
        }
    }
}

//Show user, what alerts are editing
function show_user_what_alerts_are_editing() {
    console.log("Maciaaaaaa !!", selected_alerts.length);
    //Show alerts selectets
    var content = "<label>You are editing <span style='color:red;'>"+selected_alerts.length+"</span> alerts </label>";
    //Show title alerts.

    //server_connection.load_All_Titles();

    $("#info_editing").html(content);
}



function EditSelected(button) {
    if (selected_alerts.length != 0) {
        //Se pueden editar alertas
        button.dataset.target = "#EditAlert";
        //show_user_what_alerts_are_editing();
    } else {
        //No se puede editar ninguna alerta ya que no hay ninguna seleccionada
        console.log("Error no se puede editar, no hay alertas seleccionadas!");
        alert("No hay alertas seleccionadas");
    }
}

// All this functions must be on server_connection.js
function load_All_Titles(alerts_id) {
    console.log("HOLAAAAAA DESDE OTRO FICHERO");
    //exit();
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