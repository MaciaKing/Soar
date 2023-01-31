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

//_______________________________________________________________________________________________________________________
//All this functions must be on the reciver side. This file is only for database class and functions.
//SI QUIERES REDUCIR EL TIEMPO DE ESPERA, TIENES QUE REDUCIR EL TIEMPO DE ENVIO DE LAS CONSULTAS, PARA HACER ESO SIEMPRE INTENTA FILTRAR POR DIAS.
//_______________________________________________________________________________________________________________________

function get_alerts_by_all_filters(){
}

/**
 * Get the alerts by simple filter.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $SimpleFilter indicates the range of time to filter the alerts. Is in days. Is a number(Integer).
 */
function get_alerts_by_simple_filter($SimpleFilter){
  $db = new DBClass();
  $db->openConnection();

  $query="SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event;
  JOIN alerta ON event.incident_id=alerta.incident_id AND CAST(alerta.alert_time AS DATE) >= (current_date - INTERVAL '$SimpleFilter DAYS');
  JOIN usr ON alerta.idUser=usr.idUser; 
  ORDER BY alerta.alert_time DESC;";
  
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);
  $db->freeResult($res);
  $db->close();
}

//Filtrado básico de rango de tiempo, 24h, 48h, etc..
function getAlertsInRange($range){
  //echo gettype($range);	
  $db = new DBClass();
  $db->openConnection();

/*
 Primera Opció
SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event 
JOIN alerta ON event.incident_id=alerta.incident_id AND CAST(alerta.alert_time AS DATE) BETWEEN NOW() - INTERVAL '24 HOURS' AND NOW() 
JOIN usr ON alerta.idUser=usr.idUser 
ORDER BY alerta.alert_time DESC;

 Segona Opció
SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event 
JOIN alerta ON event.incident_id=alerta.incident_id AND CAST(alerta.alert_time AS DATE) BETWEEN NOW() - INTERVAL '1 DAY' AND NOW() 
JOIN usr ON alerta.idUser=usr.idUser 
ORDER BY alerta.alert_time DESC;
 * */
 
  //$query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id AND CAST(alerta.alert_time AS DATE) BETWEEN NOW() - INTERVAL \'.$range. DAY\' AND NOW() JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";

  $query = "SELECT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id AND CAST(alerta.alert_time AS DATE) BETWEEN NOW() - INTERVAL '{$range} DAY' AND NOW() JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC;";

  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);
  $db->freeResult($res);
  $db->close();

}



/** 
 * Get all alerts.
 * 
 * The query is ordered by alert_time.
 */
function getAllAlerts(){	
  $db = new DBClass();
  $db->openConnection();

  //"SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id and alerta.alert >= NOW() - '1 day'::INTERVAL JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC " 

  //Distinct pq eventos puede tener más de un incicdent_id y se pueden ver alertas duplicadas 
  $query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC"; 
  $res=$db->query($query); 
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}

/**
 * Get all alerts by any filter.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $index indicates the index to filter the alerts. Is a string.
 * @param $urgen indicates the urgency to filter the alerts. Is a string.
 * @param $status_ indicates the status to filter the alerts. Is a string.
 * @param $owner indicates the owner to filter the alerts. Is a string.
 * @param $data1 indicates the first date to filter the alerts. Is a string.
 * @param $time1 indicates the first time to filter the alerts. Is a string.
 * @param $data2 indicates the second date to filter the alerts. Is a string.
 */
function getAllAlertsByAllFilters($index, $urgen, $status_, $owner, $data1, $time1, $data2, $time2){
  $db = new DBClass();
  $db->openConnection();
  
  $query= "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event JOIN alerta ON event.incident_id=alerta.incident_id";  

  if(is_null($data1)==1 and is_null($data2) ==1 and is_null($time1)==1 and is_null($time2)==1 ){
  
  }else{
  	$query .= " AND alerta.alert_time BETWEEN '$data1 $time1' AND '$data2 $time2'";
  }
  
  //echo "index --> $index \n\n";
  if( strcmp($index, 'All') !==0 ){ //Equal
    $query .= " AND fields_index='$index'";	
  }
  if( strcmp($urgen, 'All') !==0 ){ //Equal
    $query .= " AND UPPER(urgency)=UPPER('$urgen')";
  }
  if( strcmp($status_, 'All') !==0){
    $query .= " AND UPPER(status)=UPPER('$status_')";
  }

  $query .= " AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser";

  if( strcmp($owner, 'All') !==0){
  	$query .= " AND usr.name='$owner'";
  }

  $query .=" ORDER BY alerta.alert_time DESC";

  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


/** 
 * Get alerts by index.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $index indicates the index to filter the alerts. Is a string.
 */
function getAlertsByIndex($index){
  $db = new DBClass();
  $db->openConnection();
  $query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.fields_index='$index' AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


/** 
 * Get alerts by status.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $sta indicates the status to filter the alerts. Is a string.
 */
function getAllAlertsByStatus($sta){
  $db = new DBClass();
  $db->openConnection();
  if($sta == '*'){
     $query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  }else{
  	$query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event JOIN alerta ON  UPPER(alerta.status)=UPPER('$sta') AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  }
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}

/** 
 * Get alerts by urgency.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $urgen indicates the urgency to filter the alerts. Is a string.
 */
function getAlertsByUrgency($urgen){
  $db = new DBClass();
  $db->openConnection();
  $query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM event JOIN alerta ON  UPPER(alerta.urgency)=UPPER('$urgen') AND event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser ORDER BY alerta.alert_time DESC";
  //echo $query;
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


/* 
 * Get alerts by owner.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $owner indicates the owner to filter the alerts. Is a string.
 */
function getAlertsByOwner($owner){
  $db = new DBClass();
  $db->openConnection();
  
  $query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM usr JOIN alerta ON UPPER(usr.name)=UPPER('$owner') AND usr.iduser=alerta.iduser JOIN event ON alerta.incident_id=event.incident_id ORDER BY alerta.alert_time DESC ";
  
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}

/* 
 * Get alerts by client.
 * 
 * The query is ordered by alert_time.
 * 
 * @param $index indicates the index to filter the alerts. Is a string.
 */	
function getAlertsByClient($index){
  $db = new DBClass();
  $db->openConnection();
  
  $query = "SELECT DISTINCT alerta.incident_id, alerta.alert_time, alerta.alert, status, alerta.urgency, fields_action, fields_index, alerta.comment_, usr.name FROM usr JOIN alerta ON UPPER(usr.name)=UPPER('$owner') AND usr.iduser=alerta.iduser JOIN event ON alerta.incident_id=event.incident_id ORDER BY alerta.alert_time DESC ";
  
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


/** 
 * Get all clients.
 * 
 * Client is equivalent to fields_index.
 * 
 * @param $action indicates the action to filter the alerts. Is a string.
 */
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


/**
 * Get all status.
 */
function getAllStatus(){
  $db = new DBClass();
  $db->openConnection();
  $query = "SELECT DISTINCT status FROM alerta;";
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


/**
 * Get all users.
 */
function getAllUsr(){
  $db = new DBClass();
  $db->openConnection();
  $query = "SELECT name FROM usr";
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}

/** 
 * Get al events from an incident.
 * 
 * This query must be with LIMIT 1 because the query is used to get the first event of an incident.
 * Is only add LIMIT 1 to the query.
 * 
 * @param type $incident_id
 */
function getEvents($incident_id){
  $db = new DBClass();
  $db->openConnection();

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
  $db->freeResult($res);

  $query = "SELECT $fields  FROM event WHERE incident_id='$incident_id' LIMIT 1";
   
  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);
	
  $db->freeResult($res);
  $db->close();  
}


function get_title_alerts($incident_id){
//select alerta.alert from alerta;
//SELECT * FROM alerta WHERE alert = ANY(ARRAY['asdfas123','asdftg324']);
}


/**
 * Update alerta table
 * 
 * Update alerta table with the new values.
 * 
 * @param $incident_id array of incident_id
 * @param $comment new comment for the alert
 * @param $status new status for the alert
 * @param $owner new owner for the alert
 **/
function update_alerta($incident_id, $comment, $status, $owner){
  $db = new DBClass();
  $db->openConnection();
  foreach ($incident_id as $value) {
	  $q = "UPDATE alerta SET status='$status', comment_='$comment', iduser=(SELECT iduser FROM usr WHERE name='$owner')  WHERE incident_id='$value'";
	  $db->query($q);
  }
  $db->close();
}




