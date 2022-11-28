<?php
include 'alerts.php';

$values=array('dat','incident_id');

$recogida=$_POST['dat']; //function

if (empty($_POST[$values[2]])){
   $incident_id=$_POST[$values[2]]; 
}

$res="";

if($recogida=="getAlerts"){
	getAllAlerts();
}elseif($recogida=="getEvents"){
       echo "getEvents".$incident_id;
}else{
  $res="no coincide";
}

echo $res;


?>


