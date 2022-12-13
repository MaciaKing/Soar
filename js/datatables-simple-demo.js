window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        console.log("TABLA CARGADA EJEMPLO");
	new simpleDatatables.DataTable(datatablesSimple);
    }
/*
    const datatables = document.getElementById('table_alerts');
    if (datatables) {
	console.log("SUUU !!");
        new simpleDatatables.DataTable(datatables);
    }
    */
});





