<?php
//$pp = mysqli_connect("localhost","root","") or die("adios");
//$db = mysqli_select_db($pp,"adiiu") or die("hola");
include 'alerts.php';

$recogida=$_POST['dat'];
$res="";

if($recogida=="macia"){
	//$res="si coincide";
	getAllAlerts();
}else{
	$res="no coincide";
}

echo $res;


?>


