<?php
include 'alerts.php';

// this param is used to know what function to call
$recogida=$_POST['dat']; 

// All this params are used to filter the alerts.
if(!empty($_POST['day'])){
        $day=$_POST['day'];
}

if(!empty($_POST['incident_id'])){
	$inci=$_POST['incident_id'];
}

if(!empty($_POST['owner'])){
        $owner=$_POST['owner'];
}

if(!empty($_POST['comment'])){
        $comment=$_POST['comment'];
}

if(!empty($_POST['status_'])){
        $status_=$_POST['status_'];
}

if(!empty($_POST['urgency'])){
        $urgen=$_POST['urgency'];
}

if(!empty($_POST['index'])){
        $index=$_POST['index'];
}

if(!empty($_POST['time1'])){
        $time1=$_POST['time1'];
}

if(!empty($_POST['time2'])){
        $time2=$_POST['time2'];
}

if(!empty($_POST['data1'])){
        $data1=$_POST['data1'];
}

if(!empty($_POST['data2'])){
        $data2=$_POST['data2'];
}



//_______________________________________________________________________________________
// This must change to
// 1. Only one query with all filters.
// 2. One query for all the filters.
// 3. Updates the alerts 
// 4. All necesary querys like get users, get clients, etc.
//
// The idea is that all functions that are on reciver, must be inside the class alerts.
//_______________________________________________________________________________________


// Depending on the param, the function is called.
if($recogida=="getAlerts"){
	getAllAlerts();
}elseif($recogida=="getEvents"){
	getEvents($inci);
}elseif($recogida=="updateAlertas"){
	echo "incidentid=", $inci ," comment =",$comment, " status_ =",$status_, " owner= ",$owner ;
	update_alerta($inci, $comment, $status_, $owner);	
}elseif($recogida=="getAlertsByStatus"){
	getAllAlertsByStatus($status_);
}elseif($recogida=="getAlertsByUrgency"){
 	getAlertsByUrgency($urgen);
}elseif($recogida=="getAlertsByOwner"){
	getAlertsByOwner($owner);	
}elseif($recogida=="getAllClients"){
	getAllClients();
}elseif($recogida=='getAlertsByClient'){
	getAlertsByIndex($index);
}elseif($recogida=='getAllUsr'){
	getAllUsr();
}elseif($recogida=='getAlertsByAllFilters'){ 
	getAllAlertsByAllFilters($index, $urgen, $status_, $owner, $data1, $time1, $data2, $time2 );
}elseif($recogida =='getAlertsByOneDayRange'){
	getAlertsInRange($day);
}else{
	echo gettype($recogida);
}





?>

