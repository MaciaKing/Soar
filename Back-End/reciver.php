<?php
include 'alerts.php';


$recogida=$_POST['dat']; //function
//$incident_id=$_POST['incident_id'];

if(!empty($_POST['incident_id'])){
	$inci=$_POST['incident_id'];
}

//echo "inciiiideeeent=".$incident_id;

//if (!empty($_POST[$values[2]])){
//   $incident_id=$_POST[$values[2]]; 
//}

$res="";

if($recogida=="getAlerts"){
	getAllAlerts();
}elseif($recogida=="getEvents"){
	getEvents($inci);
}else{
  $res="no coincide";
}

echo $res;


?>


