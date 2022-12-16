<?php	
//require_once( 'DBSettings.php' ); 

include 'DBSettings.php';

//Database class to connect to database and fire queries
class DBClass extends DatabaseSettings{

	var $classQuery; //borra
	var $link; //borra
	private $conn_string;
	private $dbconn;
	
	var $errno = '';
	var $error = '';
	
	// Connects to the database
	function openConnection(){
		// Load settings from parent class
	//	$settings = DatabaseSettings::getSettings();
		
		// Get the main settings from the array we just loaded
	//	$host = $settings['dbhost'];
	//	$name = $settings['dbname'];
	//	$user = $settings['dbusername'];
	//	$pass = $settings['dbpassword'];

		// Connect to the database
		$this->conn_string = "host=localhost port=5432 dbname=prueba user=soar password=soar";
		$this->dbconn = pg_connect($this->conn_string);
	}
	
	// Executes a database query
	function query( $query ){
                return pg_query($this->dbconn,$query);
	}
	
	function escapeString( $query ){
		return $this->link->escape_string( $query );
	}
	
	// Get the data return int result
	function numRows( $result ){
		return $result->num_rows;
	}
	
	function lastInsertedID(){
		return $this->link->insert_id;
	}
	
	// Get query using assoc method
	function fetchAssoc( $result ){
		return $result->fetch_assoc();
	}
	
	// Gets array of query results
	function fetchArray( $result , $resultType = MYSQLI_ASSOC ){
		return $result->fetch_array( $resultType );
	}
	
	// Fetches all result rows as an associative array, a numeric array, or both
	function fetchAll( $result , $resultType = MYSQLI_ASSOC ){
		return $result->fetch_all( $resultType );
	}
	
	// Get a result row as an enumerated array
	function fetchRow( $result ){
		return $result->fetch_row();
	}
	
	// Free all MySQL result memory
	function freeResult( $res ){
		pg_free_result($res);
	}
	
	//Closes the database connection
	function close(){
  		pg_close($this->dbconn);	
	}
	
	function sql_error(){
		if( empty( $error ) ){
			$errno = $this->link->errno;
			$error = $this->link->error;
		}
		return $errno . ' : ' . $error;
	}
}



//All selects
function getAllAlerts(){	
  $db = new DBClass();
  $db->openConnection();

  $query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC"; 
  $res=$db->query($query); 
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


function getAllAlertsByStatus($sta){
  $db = new DBClass();
  $db->openConnection();
  if($sta == '*'){
     $query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  }else{
  	$query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event JOIN alerta ON  alerta.status='$sta' AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  }
  //echo $query;
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}
 
function getAlertsByUrgency($urgen){
  $db = new DBClass();
  $db->openConnection();
  $query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event JOIN alerta ON  alerta.urgency='$urgen' AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  //echo $query;
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


function getAlertsByOwner($owner){
  $db = new DBClass();
  $db->openConnection();
  //$query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event JOIN alerta ON  alerta.urgency='$urgen' AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser";
  $query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM usr JOIN alerta ON usr.name='$owner' AND usr.iduser=alerta.iduser JOIN event ON alerta.incident_id=event.incident_id ORDER BY alerta.alert_time DESC ";
  //echo $query;
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}



function getAllClients(){
  $db = new DBClass();
  $db->openConnection();
  $query = "SELECT DISTINCT fields_index FROM event";
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}



function getEvents($incident_id){
  $db = new DBClass();
  $db->openConnection();

 // $query = "SELECT fields_host, fields_dest_ip, fields_dest_port, fields_source, fields_source_ip, fields_src_ip,fields_src_user, fields_user, fields_ta_windows_action, fields_signature, fields_url, fields_srcip, fields_vlan_dst, fields_vlan_src, fields_dstip, fields_index, fields_score, fields__raw  FROM event WHERE incident_id='$incident_id' LIMIT 1";
 

  $q1 = "SELECT column_name FROM information_schema.columns WHERE table_name = 'event'";
  $res=$db->query($q1);
  $fields='';
  $aux=0;
  while ($row = pg_fetch_row($res)) {
	  if ($aux===0){
		  $fields .= $row[0];
	  	  $aux=1;
	  } else{
	  	$fields .= ",".$row[0];
	}	  
   }
  //echo $fields;
  $db->freeResult($res);

  $query = "SELECT $fields  FROM event WHERE incident_id='$incident_id' LIMIT 1";
   
  //echo $query."\n";

  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);
	
  $db->freeResult($res);
  $db->close();  
}



//All Updates
function update_alerta($incident_id, $comment, $status, $owner){
  $db = new DBClass();
  $db->openConnection();
  foreach ($incident_id as $value) {
	$q = "UPDATE alerta SET status='$status', comment_='$comment', iduser=(SELECT iduser FROM usr WHERE name='$owner')  WHERE incident_id='$value'";
	echo "\n".$q;
	$db->query($q);
  }

  echo "  \n\nUPDATE";

}




