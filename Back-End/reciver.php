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


$res="";

if($recogida=="getAlerts"){
	getAllAlerts();
}elseif($recogida=="getEvents"){
	getEvents($inci);
}elseif($recogida=="updateAlertas"){
	//$incident_id, $comment, $status, $owner
	//$p='sii';
	//echo $p;
	//echo 'suu';
	update_alerta($inci, $owner, $comment, $status_);	
}else{
	//echo "No coincide m11 ".$recogida." m22";
	echo gettype($recogida);
}

echo $res;


?>


