
//Para probar los ficheros de php si funcionan, se probaran en este fichero 

function query1(){
	jQuery.ajax({
   		type: "POST",
    		url: 'your_functions_address.php',
   		dataType: 'json',
    	       //data: {functionname: 'add', arguments: [1, 2]},
		data: {functionname: 'add', arguments},
   		success: function (obj, textstatus) {
                	  if( !('error' in obj) ) {
                  		yourVariable = obj.result;
                   	  } else {
                  	   	 console.log(obj.error);
               	   	  }
        	  	 }
	});

}

