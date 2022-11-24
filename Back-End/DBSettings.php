<?php
class DatabaseSettings{
	var $settings;

	function getSettings(){
		/*
		USER_DB="soar"
		PASSW_DB= "soar"
		HOST_DB="localhost"
		NAME_DB="soardatabase"
 		*/

		// Database variables
		// Host name
		$settings['dbhost'] = 'soar';
		// Database name
		$settings['dbname'] = 'soardatabase';
		// Username
		$settings['dbusername'] = 'soar';
		// Password
		$settings['dbpassword'] = 'soar';
		
		return $settings;
	}
}
?>






