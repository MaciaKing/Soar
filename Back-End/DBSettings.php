<?php
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






