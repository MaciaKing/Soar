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

  //$query = "SELECT incident_id, fields__time, title, owner, status, fields_urgency, fields_action, index  FROM event"; //IDEAL
  //$query = "SELECT incident_id, fields__time, title, fields_urgency, fields_action, index  FROM event";
  $query = "SELECT alerta.incident_id, fields__time, alerta.title, fields_urgency, fields_action, fields_index, alerta.comment_, usr.name  FROM event JOIN alerta ON event.incident_id=alerta.incident_id JOIN usr ON alerta.idUser=usr.idUser";
  $res=$db->query($query); 
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);

  $db->freeResult($res);
  $db->close();
}


function getEvents($incident_id){
  $db = new DBClass();
  $db->openConnection();

  //Ideal tenir tables separades de ALERTS i EVENTS
  //$query = "SELECT * EXCEPT(incident_id, fields__time, title, fields_urgency, fields_action, index) FROM event WHERE incident_id=".$incident_id;
  $query = "SELECT fields_host, fields_dest_ip, fields_dest_port, fields_source, fields_source_ip, fields_src_ip,fields_src_user, fields_user, fields_ta_windows_action, fields_signature, fields_url FROM event WHERE incident_id='$incident_id'";


  $res=$db->query($query);
  $allRes=pg_fetch_all($res);
  echo json_encode($allRes);
	
  $db->freeResult($res);
  $db->close();  
}

//All Updates
function update_alerta($incident_id, $comment, $status, $owner){


}


