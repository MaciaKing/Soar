<?php
//$pp = mysqli_connect("localhost","root","") or die("adios");
//$db = mysqli_select_db($pp,"adiiu") or die("hola");

$recogida=$_POST['dat'];
echo $recogida;

if($recogida=="data1macia"){
	data1macia();
	echo "CONECTAADOOOOO !!!";
}else{
	echo "NO RECOGIDA";
}



?>


