/*!
    * Start Bootstrap - SB Admin v7.0.5 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2022 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
// 
// Scripts
// 
var divs = new Array("DASHBOARD", "ALERTAS"); //Variable donde guardamos los divs que ocultamos y mostramos.
var selected_alerts = []; //Variable donde editamos las Alertas seleccionadas.

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});


function showHideRow(row) {
    $("#" + row).toggle();
}


//selectAlert:
//param: - val. Indica si la alerta estaba seleccionada o no.
//       - idAlert. Nombre identificatico de esta alerta.
//Cada vez que el usuario clicke el boton de seleccionado, se guardará esta row.
//Si esta ya estaba seleccionada, se deseleccionara y se guardaran los cambios en 
//select_alerts.
function selectAlert(val, idAlert) {
    console.log("Valor", val.checked);
    if (val.checked) {
        //Añadimos la alerta
        selected_alerts.push(idAlert);
        console.log("ALERTAAA: "+ idAlert);
        console.log("Selected Alerts: "+ selected_alerts);
    } else {
        //Quitamos la alerta
        aux=[];
        for(var i=0; i<selected_alerts.length ;i++){
            if(selected_alerts[i].localeCompare(idAlert) != 0){
                //selected_alerts[i].shift(aux)
                //val.checked=false;
                aux.push(selected_alerts[i]);
            }
            
        }        
        selected_alerts=aux;
        console.log("Desceleccionar alerta: "+aux);
        console.log("Selected Alerts: "+selected_alerts);
    }
}

//selectAlert:
//Deselecionamos todas las alertas.
function cleanAll(){
    console.log("Limpiamos todas las alertas");
    for(var i=0; i<selected_alerts.length;i++){
        document.getElementById(selected_alerts[i]).childNodes[1].children[0].children[0].checked=false; // Deseleccionamos del DOM las alertas.
    }
    selected_alerts=[]; // Borramos todas las alertas seleccionadas.
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

//desplegar:
//Función que permite desplegar una row debajo en una línea de una tabla.
function m() {
    console.log("DESPLEGAR");
}


//desplegar:
//Función que permite desplegar una row debajo en una línea de una tabla.
//function desplegar(tabla_a_desplegar, estadoT) {
function desplegar(tabla_a_desplegar/*, estadoT*/) {
    console.log("DESPLEGAR");
    var tablA = document.getElementById(tabla_a_desplegar);
    tablA.style.display = "none";

    /*
    var estadOt = document.getElementById(estadoT);

    switch (tablA.style.display) {
        case "none":
            tablA.style.display = "block";
            estadOt.innerHTML = "Ocultar coneNido"
            break;
        default:
            tablA.style.display = "none";
            estadOt.innerHTML = "Mostrar coNteNido"
            break;
    }
    */
}