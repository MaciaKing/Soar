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

// Function to add event listener to all butons of alerts table
function load() {
    var a1 = document.getElementsByClassName('btn btn-primary');
    for( var i=0;i<a1.length;i++){
        console.log(" i --> ", i, a1[i]);

    }
}

//Funciona
function showHideRow(row) {
    console.log("Desplegar")
    var x=$("#" + row).toggle();
    console.log("x --> ", x)
    load();
}


/*
function createEventListenersInATable(){
    console.log("MACIAA");
    table_alerts=document.getElementById("table_alerts");
    console.log( typeof table_alerts);
}*/

/*
// Function to change the content of t2
function modifyText() {
    const t2 = document.getElementById("t2");
    const isNodeThree = t2.firstChild.nodeValue === "three";
    t2.firstChild.nodeValue = isNodeThree ? "two" : "three";
  }
  
// Add event listener to table
const el = document.getElementById("table_alerts");
el.addEventListener("click", modifyText, false);
*/


//selectAll:
//Select all alerts that is show on the screen
function selectAll(){
    console.log("Select All");
    
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



