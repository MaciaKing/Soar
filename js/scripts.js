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


function showAlerts(alerts_to_show){
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
	console.log(document.getElementById("table_alerts"));
	var div=document.getElementById("table_alerts");
	//SELECT incident_id, fields__time, title, fields_urgency, fields_action, index  FROM event
        //Cabecera de la taula
	div.innerHTML='' //Para que siempre se actualize y no queden restos de la tabla anterior
	var content= '<thead><tr><th scope=\"col\">Actions</th> <th scope=\"col\">Time</th><th scope=\"col\">Title</th><th scope=\"col\">Urgency</th><th scope=\"col\">Action</th><th scope=\"col\">Index</th></tr></thead>'; 
	//div.innerHTML += content;

	//Afegim les alertes
	console.log(typeof(alerts_to_show));
	//console.log("ALERTS --> ", typeof(alerts), alerts);
	
	content+='<tbody>';
	for (var i = 0; i < alerts_to_show.length; i++){
 		//document.write("<br><br>array index: " + i);
  		console.log("i = ",i);
		var obj = alerts_to_show[i];
  		console.log(obj);
		var aux=0
		var aux_id='';
		for (var key in obj){
			var value = obj[key];
			if(aux==0){//idAlert	
		  	  aux_id=value;	
		          content+='<tr id=\"'+value+'\"><td><div><input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"flexCheckIndeterminate\" onclick=\"selectAlert(this,\''+value +'\')\" ><button type=\"button\" class=\"btn btn-primary\" onclick=\"showHideRow(\'hidden_row_'+value+'\',\''+value+'\')\" ><i class=\"far fa-eye\" width=\"10\" height=\"10\"></i></button><button type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" onclick=\"quickEdit(this)\"  data-target=\"#EditAlert\"><i class=\"fas fa-edit\" width=\"10\" height=\"10\"></i></button> </div></td>';
			  aux=aux+1;
			}else{
			  //document.write("<br> - " + key + ": " + value);
                          //console.log(key," --> ", value)
		          content+='<td>'+ value+'</td>';
			}
		}
		content+='<tr id=\"hidden_row_'+aux_id+'\" class=\"hidden_row\" style=\"display: none;\"> <td colspan=4> INFORMACION DE LA ALERTA !!!!!!!!!!!!!</td></tr></tr>';
	}
	content+='</tbody>';
	div.innerHTML += content;
	console.log("CONTENT--> ",content);
}


function loadAlerts() {
    //var alertas=null;	
    var alertas= jQuery.ajax({
        //type: "POST",
	type: 'POST',
	//url: './php/connect.php',
        url: './Back-End/reciver.php',
	dataType:"json",
	data: {
            dat: "getAlerts"
        },
        success: function (data) {
          console.log("Recibido --> ",data);
	  showAlerts(data);
	  //return data;
	},
	error: function(xhr, status, error) {
 	  var err = eval("(" + xhr.responseText + ")");
  	  alert(err.Message);
	}
    });
}


function viewEventAlert(data, div){
	/*
	 <table border="2" bordercolor="blue">
                    <tr>
                        <td>inner Table row 1 column 1</td>
                        <td>inner Table row 1 column 2</td>
                    </tr>
                    <tr>
                        <td>inner Table row 2 column 1 </td>
                        <td>inner Table row 2 column 2</td>
                    </tr>
                    <tr>
                        <td>inner Table row 3 column 1 </td>
                        <td>inner Table row 3 column 2</td>
                    </tr>
                </table>
	*/

	var div_element = document.getElementById(div);
	var content='';
	content = '<td>';
	console.log("dades a mostrar "+typeof(data));
	var events = JSON.parse(data);
	console.log(typeof(events));
	for (var i = 0; i < events.length; i++){
                var obj = events[i];
                console.log(obj);
                for (var key in obj){
		    //console.log("LENGTHHH ", obj[key].length)	
		   if(obj[key].length ===1){
		       content+=key+':\t - <br>';
		   }else{
		   	content+=key+':\t'+obj[key]+'<br>';	
		   }
		 }
	}
	
	content+='</td>';
	div_element.innerHTML=content;
	console.log(content);
}


function loadEvent(incident){
	var events= jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        //dataType:"json",
        data: {
		dat: "getEvents", incident_id: incident
        },
        success: function (data) {
          viewEventAlert(data, ("hidden_row_"+incident));
        },
        error: function(xhr, status, error) {
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
        }
    });
}



function showHideRow(row,incident_id) {
    console.log("search events for --> "+incident_id);
    loadEvent(incident_id);
    var x = $("#"+row).toggle();
    //console.log("FIN");
}


function selectNewAlert(id_alert){
    var isSelected=false;
    //Comprovar que no haya estado seleccionada antes
    for (var i = 0; i < selected_alerts.length && !isSelected; i++) {
        if(selected_alerts[i]==id_alert){
            isSelected=true;
        }
    }
    //Si la alerta no estaba seleccionada, la seleccionamos
    if(!isSelected){ 
        selected_alerts.push(id_alert);
    }
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

function EditAll(button){
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

//ocultarTodosDivsYMostrar1: 
//  param: divToShow    --> id= "divToShow"
//Ocultamos todos los divs y solo mostramos el idDivs que entra por parametro
function ocultarTodosDivsYMostrar1(divToShow) {
    console.log("ENSEÑAR --> "+divToShow);
    for (var i = 0; i < divs.length; i++) {
        if (divs[i] === divToShow) {
            //mostramos este divs
            console.log("Mostramos div: ", divToShow);
            document.getElementById(divToShow).style.display = "block";
           // console.log("Activado")
	    if( divs[i] == "ALERTAS"){ //Cargamos todas las alertas
	       console.log("ANTES DE CONNECTAR SERVIDOR: ");
	       loadAlerts();     
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
	//console.log(button);
        //button.dataset.target = "#NoEdit";
        //var x =document.getElementById("EditSelected");
    	//var x = document.getElementById("NoEdit");
	//console.log(x);
	alert("No hay alertas seleccionadas");
	//x.attr("NoEdit");
	
    }
}

