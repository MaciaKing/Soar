// 
// Scripts for Alerts
//




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

});


function showAlerts(alerts_to_show) {
    /*
    <tbody>
    
                                        <tr id="row1">
                                            <td>
                                                <div>
                                                    <input class="form-check-input" type="checkbox" value=""
                                                        id="flexCheckIndeterminate" onclick="selectAlert(this,'row1')">
                                                    <button type="button" class="btn btn-primary"
                                                        onclick="showHideRow('hidden_row1')"><i class="far fa-eye"
                                                            width="10" height="10"></i></button>
                                                    <button type="button" class="btn btn-primary" data-toggle="modal"
                                                        onclick="quickEdit(this)" data-target="#EditAlert">
                                                        <i class="fas fa-edit" width="10" height="10"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>Sales Assistant</td>
                                            <td>New York</td>
                                            <td>46</td>
                                        <tr id="hidden_row1" class="hidden_row" style="display: none;">
                                            <td colspan=4>
                                                INFORMACION DE LA ALERTA !!!!!!!!!!!!!
                                            </td>
                                        </tr>
                                        </tr>
     
    */
    var div = document.getElementById("maciaAlertas");
    div.innerHTML = '' //Para que siempre se actualize y no queden restos de la tabla anterior
    
    var content = '<div class="card mb-4"><div class="card-header"><i class="fas fa-table me-1"></i>Alerts</div><div id="alertas" class="card-body"><table id="table_alerts" class="table table-striped table-dark">'; // Creamos la targeta con las alertas
    
    content += '<thead><tr><th scope=\"col\">Actions</th> <th scope=\"col\">Time</th><th scope=\"col\">Title</th><th scope=\"col\">Status</th><th scope=\"col\">Urgency</th><th scope=\"col\">Action</th><th scope=\"col\">Index</th><th scope=\"col\">Comment</th><th scope=\"col\">Owner</th></tr></thead>';

    //Afegim les alertes
    console.log(typeof (alerts_to_show));
    //console.log("ALERTS --> ", typeof(alerts), alerts);

    content += '<tbody>';
    for (var i = 0; i < alerts_to_show.length; i++) {
        //document.write("<br><br>array index: " + i);
        console.log("i = ", i);
        var obj = alerts_to_show[i];
        console.log(obj);
        var aux = 0
        var aux_id = '';
        for (var key in obj) {
            var value = obj[key];
            if (aux == 0) {//idAlert	
                aux_id = value;
                content += '<tr id=\"' + value + '\"><td style="min-width:150px;"><div><input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"flexCheckIndeterminate\" onclick=\"selectAlert(this,\'' + value + '\')\" ><button type=\"button\" class=\"btn btn-primary\" style=\"margin-left:5px;\"  onclick=\"showHideRow(\'hidden_row_' + value + '\',\'' + value + '\')\" ><i class=\"far fa-eye\" width=\"10\" height=\"10\"></i></button><button type=\"button\" class=\"btn btn-primary\" style=\"margin-left:5px;\"  data-toggle=\"modal\" onclick=\"quickEdit(this)\"  data-target=\"#EditAlert\"><i class=\"fas fa-edit\" width=\"10\" height=\"10\"></i></button> </div></td>';
                //content+='<div class="btn-group btn-group-toggle" data-toggle="buttons"><label class="btn btn-secondary active"><input type="radio" name="options" id="option1" autocomplete="off" checked> Active</label><label class="btn btn-secondary"><input type="radio" name="options" id="option2" autocomplete="off"> Radio</label><label class="btn btn-secondary"><input type="radio" name="options" id="option3" autocomplete="off"> Radio</label></div>'; 
                aux = aux + 1;
                //}else if(aux==1){//time
                //  var date = new Date(0);
                //  date.setUTCSeconds(value);
                //  final_data= date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
                //  content+='<td><p>'+ final_data +'</p></td>';
                //  aux=aux+1;		
            } else {
                //document.write("<br> - " + key + ": " + value);
                //console.log(key," --> ", value)
                content += '<td><p>' + value + '</p></td>';
            }
        }
        //content+='<tr id=\"hidden_row_'+aux_id+'\" class=\"hidden_row\" style=\"display: none;\"> <td colspan=4> INFORMACION DE LA ALERTA !!!!!!!!!!!!!</td></tr></tr>';
        content += '<tr id=\"hidden_row_' + aux_id + '\" class=\"hidden_row\" style=\"display: none;\"> <td colspan=4></td></tr></tr>';
    }
    content += '</tbody>';
    content += '</table></div></div>';
    div.innerHTML += content;
    //console.log(document.getElementById('table_alerts'));
    
/*
    $(document).ready(function() {
	    console.log("REAADDDDDYYYYYYYYYYYY\n");
    	
	$('#table_alerts').dataTable({
        	"aLengthMenu": [[25, 50, 75, -1], [25, 50, 75, "All"]],
        	"iDisplayLength": 25
    	});
    });
*/
	console.log("PAGINAS CARGADAS");

    var datatables = document.getElementById('table_alerts');
    if (datatables) {
	 new simpleDatatables.DataTable(datatables, {
    	"lengthMenu": [[10, 20, 30, 40, 50], [20, 40, 60, 80, 100]],
	//"aLengthMenu": [[25, 50, 75, -1], [25, 50, 75, "All"]],
	//"pageLength": 10
	});
	
	console.log("PAGINAS CARGADAS");
    }
    
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
    var div_element = document.getElementById(div);
    var content = '';
    content = '<tr><table><tbody><tr>';
    console.log("dades a mostrar " + typeof (data));
    console.log("dataaa :\n"+ data); 
    var events = JSON.parse(data);
    console.log(typeof (events));
    console.log("eventssss :\n"+ events);
    var raw='';
    for (var i = 0; i < events.length; i++) {
        console.log("i=", i, " events.length=", events.length)
        var obj = events[i];
        console.log(obj);
        content += '<th colspan="2">';
        for (var key in obj) {
	    console.log();
	   if (obj[key]!=null){
            if (obj[key].length != 1) {
                if (key.split("fields_").pop() === "_raw") {
		     var p=obj[key].replaceAll("<","&lt;");
		     p.replaceAll(">","&gt;");
		     raw += '<td colspan="7"><b style="color:#B77E42;"> - Raw</b>\t<br><div>' + p + '</div></td>';
		} else {
                     //limpiamos "fields_" de los eventos para que se vea mejor
		     var etiqueta= key.split("fields_").pop();
		     //Remplazamos todos los _ por " "	
		     etiqueta=etiqueta.replaceAll("_"," ");
		     //Ponemos letra mayúscula solo a la primera letra
		     //etiqueta=etiqueta.toUpperCase()
		     etiqueta= etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1);
    		     //content += '<p><b>'+ etiqueta + '</b>:\t' + obj[key] + '<br></p>';
                     content += '<p style="display:inline-block;color:#B77E42"> - '+ etiqueta + '&nbsp;</p><p style="display:inline-block;">' + obj[key] + '</p><br>';
		}
            }
	   }
        }
	content+=raw;  
        content += '</th>';
    }

    content += '</tr></tbody></table></tr>';
    div_element.innerHTML = content;
    console.log(content);
}


function filterByStatus() {
    var status_ = document.getElementById("FilterStatus").value;
    status_ = status_.toLowerCase();

   console.log("status:  MACIAAA-->" + status_);
    var alertas = jQuery.ajax({
        //type: "POST",
        type: 'POST',
        //url: './php/connect.php',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            dat: "getAlertsByStatus", status_: status_
        },
        success: function (data) {
            console.log(data);
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


function filterByOwner(/*owner*/) {
    //console.log("status: -->" + owner);
   var owner = document.getElementById("FilterOwner").value;
   
   //status_ = status_.toLowerCase();
	
    var alertas = jQuery.ajax({
        //type: "POST",
        type: 'POST',
        //url: './php/connect.php',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            dat: "getAlertsByOwner", owner: owner
        },
        success: function (data) {
            console.log(data);
            showAlerts(JSON.parse(data));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


function filterByUrgency(/*urgency*/) {
    //console.log("urgency: -->" + urgency);
    //console.log(" ");
    var urgency=document.getElementById("FilterUrgency").value;
    urgency= urgency.toLowerCase();
    console.log("\nURGENCY MACIA --> ", urgency)
    var alertas = jQuery.ajax({
        //type: "POST",
        type: 'POST',
        //url: './php/connect.php',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
            dat: "getAlertsByUrgency", urgency: urgency
        },
        success: function (data) {
            console.log(data);
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
        //dataType:"json",
        data: {
            dat: "getEvents", incident_id: incident
        },
        success: function (data) {
	    //console.log("BASE DE DATOS DEVUELVE", data);	
            viewEventAlert(data, ("hidden_row_" + incident));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}



function showHideRow(row, incident_id) {
    console.log("search events for --> " + incident_id);
    loadEvent(incident_id);
    var x = $("#" + row).toggle();
    //console.log("FIN");
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
    //console.log(el.parentElement.);

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


function filterByAllFilters(){
  var index = document.getElementById("FilterIndex").value;
  var urgency = document.getElementById("FilterUrgency").value;
  var status_ = document.getElementById("FilterStatus").value;
  var owner = document.getElementById("FilterOwner").value;
  
  var data1 = document.getElementById("data1").value;
  var data2 = document.getElementById("data2").value;
  var time1 = document.getElementById("time1").value;
  var time2 = document.getElementById("time2").value;
  //console.log("Index :",index, " urgency :",urgency, " status :",status_, " owner :",owner );  
  console.log("data1 --> ", data1,"\ndata2 --> ",data2, "\ntime1 --> ", time1, "\ntime2 --> ", time2);

  var query = jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {

		dat: "getAlertsByAllFilters", index:index, urgency:urgency, status_:status_, owner:owner,
		time1:time1, time2:time2, data1:data1, data2:data2
        },
        success: function (data) {
	    console.log(data);	
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
            dat: "getAlertsByClient", index:index
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


function loadUsers(){
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


function showUsers(users){
    var content='<option selected>All</option>';
    for (var i = 0; i < users.length; i++){
        var obj = users[i];
        for (var key in obj){
                var value = obj[key];
                console.log("valor "+ value);
                content+='<option>'+value+'</option>';
        }
    }
    document.getElementById('FilterOwner').innerHTML = content;
}


function showClients(clients){
    const json = JSON.parse(clients);
    var content='<option selected>All</option>';
    for (var i = 0; i < json.length; i++){
        var obj = json[i];
        for (var key in obj){
                var value = obj[key];
                console.log("valor "+ value);
                content+='<option>'+value+'</option>';
        }
    }
    document.getElementById('FilterIndex').innerHTML = content;
    console.log("content --> ", content);
}

/*
function showClients(clients){
    //console.log("maciaaa");
    const json = JSON.parse(clients);
    var content='';
    console.log("MACIA 2");
    for (var i = 0; i < json.length; i++){
  	var obj = json[i];
  	for (var key in obj){
    		var value = obj[key];
		console.log("valor "+ value);
		content+='<a class="dropdown-item" onclick="filterByClient(\''+value+'\')">'+value+'</a>';
  	}
    }    

    //var div=document.getElementByid('dropdownCliente');
    //div.innerHTML += content;
    document.getElementById('dropdownCliente').innerHTML += content;
}
*/

//clients === index
function loadClients(){
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

function resetFilters(){
  document.getElementById("FilterUrgency").value='All';
  document.getElementById("FilterIndex").value='All';
  document.getElementById("FilterStatus").value='All';
  document.getElementById("FilterOwner").value='All';
  
  document.getElementById("data1").value=null;
  document.getElementById("data2").value=null;
  document.getElementById("time1").value=null;
  document.getElementById("time2").value=null;
  loadAlerts(); 
}


//ocultarTodosDivsYMostrar1: 
//  param: divToShow    --> id= "divToShow"
//Ocultamos todos los divs y solo mostramos el idDivs que entra por parametro
function ocultarTodosDivsYMostrar1(divToShow) {
    for (var i = 0; i < divs.length; i++) {
        if (divs[i] === divToShow) {
            //mostramos este divs
            console.log("Mostramos div: ", divToShow);
            document.getElementById(divToShow).style.display = "block";
            if (divs[i] == "ALERTAS") { //Cargamos todas las alertas
		//loadClients();
                //loadUsers();
		loadAlerts();
		loadClients();
		loadUsers();
            }
        } else {
            //ocultamos el divs
            console.log("Ocultamos div: " + divs[i]);
            document.getElementById(divs[i]).style.display = "none";
        }
    }
}

function EditSelected(button) {
    //console.log(button);
    if (selected_alerts.length != 0) {
        //Se pueden editar alertas
        console.log("TRUEEEE")
        button.dataset.target = "#EditAlert";
    } else {
        //No se puede editar ninguna alerta ya que no hay ninguna seleccionada
        console.log("Error no se puede editar, no hay alertas seleccionadas!");
        alert("No hay alertas seleccionadas");

    }
}

