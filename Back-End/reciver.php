<?php
include 'alerts.php';


$recogida=$_POST['dat']; //function

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


// Esto tendria q cambiar a  
// 1. Solo una query con todas los filtros.
// 2. Una query por solo filtro de un dia (Como splunk).

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
	//echo $day;
}else{
	echo gettype($recogida);
}





?>

