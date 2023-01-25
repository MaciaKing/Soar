// This file will be all the Ajax Connections

export function load_All_Titles(alerts_id) {
    console.log("HOLAAAAAA DESDE OTRO FICHERO");
    jQuery.ajax({
        type: 'POST',
        url: './Back-End/reciver.php',
        dataType: "json",
        data: {
            dat: "getAlertsByOneDayRange", day: dayRange
        },
        success: function (data) {
            console.log("Nuevo ficheroooo --> ", data);
            return data;
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}
