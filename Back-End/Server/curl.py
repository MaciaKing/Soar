'''
import splunklib.client as client
import splunklib.results as results
import psycopg2
import json, xmltodict
import threading
import time
from enum import Enum
#Encrypt
import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
'''    
from Database.Database import Database
from SplunkApi.SplunkAPI import SplunkAPI
import threading
import time


events = {'incident_id':'', 'fields{}._raw':'','fields{}.EventCode':'','fields{}._time':'','fields{}.action':'','fields{}.app':'','fields{}.cat':'','fields{}.catdesc':'','fields{}.category':'','fields{}.conn_count':'','fields{}.date':'','fields{}.dest_ip':'','fields{}.dest_port':'','fields{}.devname':'','fields{}.diff_deviation':'','fields{}.eventtype':'','fields{}.host':'','fields{}.index':'','fields{}.level':'','fields{}.msg':'','fields{}.severity':'','fields{}.signature':'','fields{}.source':'','fields{}.source_ip':'','fields{}.src_ip':'','fields{}.src_user':'','fields{}.srcintf':'','fields{}.subtype':'','fields{}.ta_windows_action':'','fields{}.time':'', 'fields{}.srcip':'', 'fields{}.vlan_dst':'', 'fields{}.vlan_src':'', 'fields{}.dstip':'', 'fields{}.index':'' , 'fields{}.score':'' ,'fields{}.type':'','fields{}.url':'','fields{}.user':''}

alerts = {'incident_id':'', 'alert_time':'', 'alert':'', 'status':'', 'index':'', 'host':'' ,'tag':'' , 'urgency':'', 'iduser':''}


class Switcher():
    def sw_alert(self):
        global alerts
        return ["alerta", alerts]

    def sw_event(self):
        global events
        return ["event", events]


def deamon():
    global database
    global splunk
    global querys_for_splunk

    all_inserts_alerts = []
    all_inserts_events = []
    '''
    while True:
        for query in querys_for_splunk:
            query_result_from_splunk = splunk.make_query(query)    
            for result in query_result_from_splunk:
                s = Switcher()
                table_name, parser = s.sw_alert()
                
                database.get_all_inserts_from_json(result, all_inserts_alerts, table_name, parser, isAlert=True)
                s = Switcher()
                table_name, parser = s.sw_event()
                database.get_all_inserts_from_json(result, all_inserts_events, table_name, parser, isAlert=False)
            
            final_insert_alert = database.join_all_inserts(all_inserts_alerts, on_conflict_insert="ON CONFLICT (incident_id) DO NOTHING")
            final_insert_event = database.join_all_inserts(all_inserts_events, on_conflict_insert="ON CONFLICT (fields__raw) DO NOTHING")
            print("FINAL INSERT ALERTA \n", final_insert_alert, "\n\n\n", "FINAL INSERT EVENTS \n", final_insert_event)
            
            database.make_insert_database([final_insert_alert,final_insert_event]) # Make finals inserts to database
            # Reset vars
            all_inserts_alerts = []
            all_inserts_events = []
            time.sleep(120)
    '''

    for query in querys_for_splunk:
        query_result_from_splunk = splunk.make_query(query)
        for result in query_result_from_splunk:
            s = Switcher()
            table_name, parser = s.sw_alert()
            database.get_all_inserts_from_json(result, all_inserts_alerts, table_name, parser, isAlert=True)
            s = Switcher()
            table_name, parser = s.sw_event()
            database.get_all_inserts_from_json(result, all_inserts_events, table_name, parser, isAlert=False)

        final_insert_alert = database.join_all_inserts(all_inserts_alerts, on_conflict_insert="ON CONFLICT (incident_id) DO NOTHING")
        final_insert_event = database.join_all_inserts(all_inserts_events, on_conflict_insert="ON CONFLICT (fields__raw) DO NOTHING")
        print("FINAL INSERT ALERTA \n", final_insert_alert, "\n\n\n", "FINAL INSERT EVENTS \n", final_insert_event)

        database.make_insert_database([final_insert_alert,final_insert_event]) # Make finals inserts to database
        # Reset vars
        all_inserts_alerts = []
        all_inserts_events = []


querys_for_splunk = ["search index=\"alerts_omniaccess\" AND action=\"create\" status=new NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status, urgency| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id _time fields{}.* ] | rename column as Field, \"row 1\" as value"]
database = None
splunk = None


### MAIN ###
if __name__ == "__main__":
    database = Database()
    splunk = SplunkAPI()

    t = threading.Thread(target=deamon)
    t.start()




