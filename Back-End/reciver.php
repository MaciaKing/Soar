<?php
include 'alerts.php';


$recogida=$_POST['dat']; //function
//$incident_id=$_POST['incident_id'];
//echo "rec";

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


$res="";

if($recogida=="getAlerts"){
	getAllAlerts();
}elseif($recogida=="getEvents"){
	getEvents($inci);
}elseif($recogida=="updateAlertas"){
	echo "incidentid=", $inci ," comment =",$comment, " status_ =",$status_, " owner= ",$owner ;
	update_alerta($inci, $comment, $status_, $owner);	
	//update_alerta($incident_id, $comment, $status, $owner)
}elseif($recogida=="getAlertsByStatus"){
	//echo $status_;
	getAllAlertsByStatus($status_);
}elseif($recogida=="getAlertsByUrgency"){
	//echo $urgen;	
 	getAlertsByUrgency($urgen);
}else{
	//echo "No coincide m11 ".$recogida." m22";
	echo gettype($recogida);
}
//getAlertsByUrgency
echo $res;


?>


