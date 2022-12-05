<?php
include 'alerts.php';


$recogida=$_POST['dat']; //function
//$incident_id=$_POST['incident_id'];

if(!empty($_POST['incident_id'])){
	$inci=$_POST['incident_id'];
}



$res="";

if($recogida=="getAlerts"){
	getAllAlerts();
}elseif($recogida=="getEvents"){
	getEvents($inci);
}elseif($recogida=="updateAlertas"){
	echo "UPDATE !!!!!!!!!!!!!!!!!!!!!!!!!!";
}else{
  $res="no coincide";
}

echo $res;


?>


