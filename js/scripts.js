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
	console.log(document.getElementById("table_alerts"));
	var div=document.getElementById("table_alerts");
	//SELECT incident_id, fields__time, title, fields_urgency, fields_action, index  FROM event
        //Cabecera de la taula
	var content= '<thead><tr><th scope="col">Time</th><th scope="col">Title</th><th scope="col">Urgency</th><th scope="col">Action</th><th scope="col">Index</th></tr></thead>'; 
	div.innerHTML = content;

	//Afegim les alertes
	console.log(typeof(alerts_to_show));
	//console.log("ALERTS --> ", typeof(alerts), alerts);
	
	content+="<tbody>";
	for (var i = 0; i < alerts_to_show.length; i++){
 		//document.write("<br><br>array index: " + i);
  		console.log("i = ",i);
		var obj = alerts_to_show[i];
  		console.log(obj);
		for (var key in obj){
    			var value = obj[key];
    			//document.write("<br> - " + key + ": " + value);
  			console.log("valor --> ", value);
		}
	}
	content+="</tbody>";
	//console.log("MACIAAAAAAAA !!!!!!!!!!!2222", alerts_to_show);
	//console.log("MACIAAAAAAAA !!!!!!!!!!!2222 FIIIIIN")
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
            dat: "macia"
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

    //console.log("MACIAAAAAAAA !!!!!!!!!!!1");
    //console.log("Alertas recibidas"+alertas);
}



function showHideRow(row) {
    var x = $("#" + row).toggle();
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

//selectAlert:
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
        button.dataset.target = "#showError";
    }
}

