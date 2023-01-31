<?php
/**
 * DatabaseSettings.php
 * 
 * This class is for save the password and username of the database, saflly. 
 * All the information must be encrypted.
 */
class DatabaseSettings{
	var $settings;
	function getSettings(){
		// Database variables
		// Host name
		$settings['dbhost'] = '';
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






