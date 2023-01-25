//De incidents_posture.js, los imports
require.config({
    paths: {
        "app": "../app"
    }
});

require([
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "underscore",
    "jquery",
    'models/SplunkDBase',
    'splunkjs/mvc/sharedmodels',
    "splunkjs/mvc/simplexml",
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/chartview',
    'splunkjs/mvc/searchmanager',
    'splunk.util',
    'util/moment',
    'select2/select2'
], function(
        mvc,
        utils,
        TokenUtils,
        _,
        $,
        SplunkDModel,
        sharedModels,
        DashboardController,
        TableView,
        ChartView,
        SearchManager,
        splunkUtil,
        moment,
        Select
    ) )




// Create log entry for comment
// linea 1466 de incident_posture.js
	// label ?
function updateSplunk(incident_id, comment, label){
            if (comment != "") {
                var log_event_url = splunkUtil.make_url('/splunkd/__raw/services/alert_manager/helpers');
                var post_data = {
                    action     : 'write_log_entry',
                    log_action : 'comment',
                    origin      : 'externalworkflowaction',
                    incident_id: incident_id,
                    comment    : label + ' workflowaction comment: ' + comment

                };
                $.post( log_event_url, post_data, function(data, status) { return "Executed"; }, "text");
            }
}




