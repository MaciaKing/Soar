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
            console.log("Activado")
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

