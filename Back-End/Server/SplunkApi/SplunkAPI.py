import splunklib.client as client
import splunklib.results as results
import json

class SplunkAPI:

    def __init__(self):
        #Params for connect to Splunk Api
        self.HOST_API = '172.20.200.175'
        self.USARNAME_API = 'oasoc.api'
        self.PASSW_API = 'YItt@$cA6KSWc!'
        self.PORT_API= 8089
        self.splunk_object=client.connect(host=self.HOST_API, port=self.PORT_API,
            username=self.USARNAME_API, password=self.PASSW_API)


    def make_query(self, query):
        '''
        Params: query

        This method is for extract any query from splunk. The query is the param
        search.
        Return search like JSON
        '''
        spl = query
        splunk_search_kwargs = {"exec_mode": "blocking",
                        "earliest_time": "-92h",
                        "latest_time": "now",
                        "enable_lookups": "true"}

        #splunk_object=client.connect(host=self.HOST_API, port=self.PORT_API,
        #           username=self.USARNAME_API, password=self.PASSW_API)


        splunk_search_job = self.splunk_object.jobs.create(spl, **splunk_search_kwargs)
        search_results_json = []
        get_offset = 0
        max_get = 1
        result_count = int(splunk_search_job['resultCount'])
        while (get_offset < result_count):
            r = splunk_search_job.results(**{"count": max_get, "offset": get_offset, "output_mode": "json"})
            obj = json.loads(r.read())
            search_results_json.extend(obj['results'])
            get_offset += max_get
        return search_results_json

    def update_alert():
        None

'''
print("hola")
splunk = SplunkAPI()
result  = splunk.make_query(["search index=\"alerts_omniaccess\" AND action=\"create\" status=* NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status, urgency| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id _time fields{}.* ] | rename column as Field, \"row 1\" as value"])

print(result)
'''

