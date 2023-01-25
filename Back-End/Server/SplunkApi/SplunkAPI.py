import splunklib.client as client
import splunklib.results as results
import requests
import json
import errno
from socket import error as SocketError

class SplunkAPI:

    def __init__(self):
        #Params for connect to Splunk Api
        self.HOST_API = '172.20.200.175'
        self.USARNAME_API = 'oasoc.api'
        self.PASSW_API = 'YItt@$cA6KSWc!'
        self.PORT_API= 8089

        self.splunk_object=client.connect(host=self.HOST_API, port=self.PORT_API,
            username=self.USARNAME_API, password=self.PASSW_API)
        '''
        self.service = Client(
                host = self.HOST_API,
                port = self.PORT_API,
                username = self.USARNAME_API,
                password = self.PASSW_API
                )
        '''


    def make_query(self, query):
        '''
        Params: query

        This method is for extract any query from splunk. The query is the param
        search.
        Return search like JSON
        '''
        spl = query
        splunk_search_kwargs = {"exec_mode": "blocking",
                        "earliest_time": "-12h",
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


    def update_alert(self):        
        #incident_id = "730eef6b-f20f-462b-b12a-68a63b022d45"
        #splunk_token = ""

        # Set up the request parameters
        #url = "https://172.20.200.175:8088/services/collector/event"
        url = "http://172.20.200.176:8088/services/collector"
        #url = "http://172.20.200.175:8088/splunkd/__raw/services/alert_manager/helpers"
        #url = "https://172.20.200.175:8088/splunkd/__raw/services/alert_manager/helpers"
        
        #headers = {"Authorization": "Splunk eyJraWQiOiJzcGx1bmsuc2VjcmV0IiwiYWxnIjoiSFM1MTIiLCJ2ZXIiOiJ2MiIsInR0eXAiOiJzdGF0aWMifQ.eyJpc3MiOiJqYW1lcy5hbHZhcmV6IGZyb20gY3liZXJzcGx1bmtoZWFkMDEiLCJzdWIiOiJqYW1lcy5hbHZhcmV6IiwiYXVkIjoic29hciBjaGFuZ2UgYWxlcnRzIiwiaWRwIjoiTERBUDovL09BX1JvbF9TcGx1bmtfQWRtaW5zIiwianRpIjoiZDg0OWVhMWQxZWMyMTNmMDlhMDJmNzMwZDE2ZWQ1MzY5NmVmMjFlYjg2YTkxZjhmNTBiZmFhNWVhZjNlODU1YiIsImlhdCI6MTY3MjkwOTMwMiwiZXhwIjoxNjc1NTAxMzAyLCJuYnIiOjE2NzI5MDkzMDJ9.4CJz471nzuAEhV2MDWFDu3JNyrRPMCNCByGPVWjiLb40F7JBXlSazjTmR1qckjCwTNX0Jdkdzxwb-htFcTfChw"}

        #headers = {"Authorization": "eyJraWQiOiJzcGx1bmsuc2VjcmV0IiwiYWxnIjoiSFM1MTIiLCJ2ZXIiOiJ2MiIsInR0eXAiOiJzdGF0aWMifQ.eyJpc3MiOiJqYW1lcy5hbHZhcmV6IGZyb20gY3liZXJzcGx1bmtoZWFkMDEiLCJzdWIiOiJqYW1lcy5hbHZhcmV6IiwiYXVkIjoic29hciBjaGFuZ2UgYWxlcnRzIiwiaWRwIjoiTERBUDovL09BX1JvbF9TcGx1bmtfQWRtaW5zIiwianRpIjoiZDg0OWVhMWQxZWMyMTNmMDlhMDJmNzMwZDE2ZWQ1MzY5NmVmMjFlYjg2YTkxZjhmNTBiZmFhNWVhZjNlODU1YiIsImlhdCI6MTY3MjkwOTMwMiwiZXhwIjoxNjc1NTAxMzAyLCJuYnIiOjE2NzI5MDkzMDJ9.4CJz471nzuAEhV2MDWFDu3JNyrRPMCNCByGPVWjiLb40F7JBXlSazjTmR1qckjCwTNX0Jdkdzxwb-htFcTfChw"}

        headers = {"Authorization": ""}

        print("H1")
        response=None
        try:
            data = {
                "action" : "update_incident",
                "incident_id" : "730eef6b-f20f-462b-b12a-68a63b022d45"
                }
            
            # Make the request
            response = requests.post(url, headers=headers, json=data)
            print("H2")
            # Check the response status code
            if response.status_code == 200:
                print("Event successfully sent to Splunk")
            else:
                print("Error sending event to Splunk: {}".format(response.text))

        except SocketError as e:
            print("Status de la peticion --> ",response.status_code)
            print("Error --> ", e)
'''
print("hola")
api = SplunkAPI()
api.update_alert()
print("fin")
'''

'''
# Test queryes
splunk = SplunkAPI()
result  = splunk.make_query(["search index=\"alerts_omniaccess\" AND action=\"create\" status=* NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status, urgency| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id _time fields{}.* ] | rename column as Field, \"row 1\" as value"])

print(result)
'''

