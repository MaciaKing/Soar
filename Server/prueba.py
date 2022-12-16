import splunklib.client as client
import splunklib.results as results
import psycopg2
import json, xmltodict
import threading
import time
from enum import Enum
#Encrypt
import os
import re
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
    

#alerts = {'_bkt': '', '_cd': '', '_indextime': '', '_kv': '', '_raw': '', '_serial': '', '_si': [''], '_sourcetype': '', '_time': '', 'action': '', 'host': '', 'index': '', 'linecount': '', 'source': '', 'sourcetype': '', 'splunk_server': '', 'status': ''}


#events = {'incident_id':'', 'title':'', 'fields{}._raw':'','fields{}.EventCode':'','fields{}._time':'','fields{}.action':'','fields{}.app':'','fields{}.cat':'','fields{}.catdesc':'','fields{}.category':'','fields{}.conn_count':'','fields{}.date':'','fields{}.dest_ip':'','fields{}.dest_port':'','fields{}.devname':'','fields{}.diff_deviation':'','fields{}.eventtype':'','fields{}.host':'','fields{}.index':'','fields{}.level':'','fields{}.msg':'','fields{}.severity':'','fields{}.signature':'','fields{}.source':'','fields{}.source_ip':'','fields{}.src_ip':'','fields{}.src_user':'','fields{}.srcintf':'','fields{}.subtype':'','fields{}.ta_windows_action':'','fields{}.time':'','fields{}.type':'','fields{}.urgency':'','fields{}.url':'','fields{}.user':'','host':'','index':'','tag':''}

events = {'fields{}._raw':'',  'incident_id':'', 'fields{}.EventCode':'','fields{}._time':'','fields{}.action':'','fields{}.app':'','fields{}.cat':'','fields{}.catdesc':'','fields{}.category':'','fields{}.conn_count':'','fields{}.date':'','fields{}.dest_ip':'','fields{}.dest_port':'','fields{}.devname':'','fields{}.diff_deviation':'','fields{}.eventtype':'','fields{}.host':'','fields{}.index':'','fields{}.level':'','fields{}.msg':'','fields{}.severity':'','fields{}.signature':'','fields{}.source':'','fields{}.source_ip':'','fields{}.src_ip':'','fields{}.src_user':'','fields{}.srcintf':'','fields{}.subtype':'','fields{}.ta_windows_action':'','fields{}.time':'', 'fields{}.srcip':'', 'fields{}.vlan_dst':'', 'fields{}.vlan_src':'', 'fields{}.dstip':'', 'fields{}.index':'' , 'fields{}.score':'' ,'fields{}.type':'','fields{}.url':'','fields{}.user':''}

#fields{}.srcip, fields{}.vlan_dst, fields{}.vlan_src, fields{}.dstip, fields{}.index, fields{}.score 
#Definir status = new 
alerts = {'incident_id':'', 'alert_time':'', 'alert':'', 'status':'', 'index':'', 'host':'' ,'tag':'' , 'urgency':'', 'iduser':''}

'''
# resultado de la query  --ng |table * -- 

{
'incident_id':'',
'title':'','title':'',
'fields{}._raw':'',
'fields{}.EventCode':'',
'fields{}._time':'',
'fields{}.action':'',
'fields{}.app':'',
'fields{}.cat':'',
'fields{}.catdesc':'',
'fields{}.category':'',
'fields{}.conn_count':'',
'fields{}.date':'',
'fields{}.dest_ip':'',
'fields{}.dest_port':'',
'fields{}.devname':'',
'fields{}.diff_deviation':'',
'fields{}.eventtype':'',
'fields{}.host':'',
'fields{}.index':'',
'fields{}.level':'',
'fields{}.msg':'',
'fields{}.severity':'',
'fields{}.signature':'',
'fields{}.source':'',
'fields{}.source_ip':'',
'fields{}.src_ip':'',
'fields{}.src_user':'',
'fields{}.srcintf':'',
'fields{}.subtype':'',
'fields{}.ta_windows_action':'',
'fields{}.time':'',
'fields{}.type':'',
'fields{}.urgency':'',
'fields{}.url':'',
'fields{}.user':'',
'host':'',
'index':'',
'tag':''
}

'''


def transform(line):
    return line.replace("{}.", "_")

def transformIndex(line):
    return line.replace("index","index_")

class Switcher():
    def sw_alert(self):
        global alerts
        return ["alerta", alerts]

    def sw_event(self):
        global events
        return ["event", events]


#Params for connect to Splunk Api
HOST_API = '172.20.200.175'
USARNAME_API = 'oasoc.api'
PASSW_API = 'YItt@$cA6KSWc!'
PORT_API= 8089

#Params for connect Postgres database
USER_DB="soar"
PASSW_DB= "soar"
HOST_DB="localhost"
NAME_DB="prueba"


#All querys to search into splunk
#cambiar a new
#querys=["search index=\"alerts_omniaccess\" AND sourcetype=\"incident_change\" status=* NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id, title, fields{}._raw, fields{}.EventCode, fields{}._time, fields{}.action, fields{}.app, fields{}.cat, fields{}.catdesc,  fields{}.category, fields{}.conn_count, fields{}.date, fields{}.dest_ip, fields{}.dest_port, fields{}.devname, fields{}.diff_deviation, fields{}.eventtype, fields{}.host,  fields{}.index, fields{}.level, fields{}.msg, fields{}.severity,  fields{}.signature,  fields{}.source, fields{}.source_ip,fields{}.src_ip,fields{}.src_user,fields{}.srcintf,fields{}.subtype,fields{}.ta_windows_action,fields{}.time,fields{}.type,fields{}.urgency,fields{}.url,fields{}.user,host,index,tag]"]
querys=["search index=\"alerts_omniaccess\" AND action=\"create\" status=new NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status, urgency| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id _time fields{}.* ] | rename column as Field, \"row 1\" as value"]

def madeCurl(query):
    '''
    Params: query

    This method is for extract any query from splunk. The query is the param
    search.
    Return search like JSON
    '''
    #spl = 'search index=* | stats count by index'
    #spl = 'search index=alerts_omniaccess earliest=-1h latest=now status=*'
    spl = query
    splunk_search_kwargs = {"exec_mode": "blocking",
                        "earliest_time": "-72h",
                        "latest_time": "now",
                        "enable_lookups": "true"}
   
    splunk_object=client.connect(host=HOST_API, port=PORT_API,
                   username=USARNAME_API, password=PASSW_API)


    splunk_search_job = splunk_object.jobs.create(spl, **splunk_search_kwargs)
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


def quitValues(stringToParse):
    None


def removeLastKey(dicc,keyToRemove):
    r=dict(dicc)
    del r[keyToRemove]
    return r

def getInserts(jsonToDatabase, add_insert, table_name, parser, isAlert=True):
    '''
    Transalate a JSON to a SQL Insert, and leave insert in add_insert array    
    '''   
    raw=re.compile(r"fields\{\}\._raw")

    insert="INSERT INTO "+ table_name +" (" + ','.join(parser)+") values ("
    auxDicc=parser.copy()
    if isAlert==True:
        last_key = list(auxDicc)[-1]
        # remove the last key using .pop() method
        removed_tuple = auxDicc.pop(last_key)
        insert=transformIndex(insert)
    else:
        insert=transform(insert)
    
    if not isAlert:
        raw=jsonToDatabase['fields{}._raw'].replace("'","''")
        insert += "'"+raw+"'"
        for key in list(auxDicc.keys())[1:]:
            try:
            #print(" Value --> ",str(jsonToDatabase[key]), "Type ", type(jsonToDatabase[key]))
            #if first_value_insert:
            #    insert+="'"+str(jsonToDatabase[key])+"'"
            #    first_value_insert=False
            #else:
                if type(jsonToDatabase[key]) == list:
                    insert+=", ARRAY "+str(jsonToDatabase[key])
                #    raw=jsonToDatabase['fields{}._raw'].replace("'","''")
                #    insert += ", '" +raw+"'"
                else:
                    insert+=", '"+str(jsonToDatabase[key])+"'"
            except:
                insert+= ",' '" #This var is not found on javascript
    else:
        firstValue=True
        for key in auxDicc.keys():
            try:
                if firstValue:
                     if type(jsonToDatabase[key]) == list:
                        insert+="ARRAY "+str(jsonToDatabase[key])
                     else:
                        insert+="'"+ str(jsonToDatabase[key])+"'"
                     firstValue=False
                else:
                     if type(jsonToDatabase[key]) == list:
                        insert+=", ARRAY "+str(jsonToDatabase[key])
                     else:
                        insert+=", '"+str(jsonToDatabase[key])+"'"
            except:
                insert+= ",' '" #This var is not found on javascript
    
    if isAlert==True:
        insert+=",1)"
    else:
        insert+=")"
    print(insert)
    add_insert.append(insert)



def joinAllInserts(all_inserts, isEvent=False):
    '''
    Join differents insert for the same type of index.
    Return a string with all this inserts.

    For example if we have
    Insert into <> values (...);  :a1
    ...
    Insert into <> values (...);  :an

    For do this inserts more efectivly is better do 
    Insert into <> values a1, ..., an; 
    '''
    final_insert=""
    first_value=True
    for i in all_inserts:
        aux=i.split("values (")
        if first_value:
            final_insert+=aux[0]+"values (" #This is INSERT INTO <table> values     
            final_insert+=aux[1] 
            first_value=False
        else:
            final_insert+=", " #For separate diferents inserts
            final_insert+="("+aux[1]
    #print("\n"+final_insert)
    if final_insert == "":
        return -1
        #print("final insert -> ", final_insert)
    else:
        if isEvent:
            None
        else:
            final_insert+=" ON CONFLICT (incident_id) DO NOTHING"
            None
        print("final insert -> ", final_insert)
    return final_insert



def makeQuery(query):
    conn = psycopg2.connect(
        host=HOST_DB,
        database=NAME_DB,
        user=USER_DB,
        password=PASSW_DB)

    cur = conn.cursor()
    cur.execute(query)
    id = cur.fetchall()

    #print("id= ",id," typeId= ",type(id))
    #print(id[0], " type --> ", type(id[0]))
    #print("final result--> ",id[0][0])

    cur = conn.cursor()
    conn.commit()
    cur.close()
    return id[0][0] #return the id of the last insert

def makeInsertDatabase(inserts):
    '''
    param: inserts [] Array of differents inserts.

    Connect to database and execute the differents inserts of param 'inserts' 
    '''
    conn = psycopg2.connect(
        host=HOST_DB,
        database=NAME_DB,
        user=USER_DB,
        password=PASSW_DB)

    cur = conn.cursor()
    for insert in inserts:
        #print("insert --> ", insert)
        cur.execute(insert)

    cur = conn.cursor()
    conn.commit()
    cur.close()


def deamon():
    global all_insert_alerts
    global all_insert_events

    while True:
        for i in querys:
        #   print("QUERY: ", i)
            results_query=madeCurl(i) #Array de JSON
            # Select max() from alerts
            #idAlert = makeQuery("select max(idalert) from alerta")
            #print("ID ALERT --> ",idAlert, " type --> ", type(idAlert))
            for result in results_query:
                # print("\n"+str(result)+"\n")
                #print("\n\n")
                s = Switcher()
                table_name, parser = s.sw_alert()
                getInserts(json.loads(json.dumps(result)), all_insert_alerts, table_name, parser, isAlert=True)
                table_name, parser = s.sw_event()
                getInserts(json.loads(json.dumps(result)), all_insert_events, table_name, parser,isAlert=False)
            #print("\n\nall_insert_alerts: ", all_insert_alerts)
            #print("\n\nall_insert_events: ", all_insert_events)
            final_insert_alerts=joinAllInserts(all_insert_alerts)
            final_insert_events=joinAllInserts(all_insert_events, isEvent=True)
            #print("\n\nfinal_insert_alerts: ",final_insert_alerts)
            #print("\n\nfinal_insert_events: ",final_insert_events)
            #Primero se hace el Insert de alerts y luego el de events ya que como esta montada la BD
            #se necesita primero que las alertas existan
            if final_insert_alerts!=-1:
                makeInsertDatabase([final_insert_alerts])
              #  None
            if final_insert_events!=-1:
                makeInsertDatabase([final_insert_events])
              #  None
            time.sleep(120)
            #Restore Alerts
            all_insert_alerts=[]
            all_insert_events=[]





all_insert_alerts=[]
all_insert_events=[]
### MAIN ###
if __name__ == "__main__":
    #Made all querys to Splunk search
   
    t = threading.Thread(target=deamon)
    t.start()
    '''
    for i in querys:
     #   print("QUERY: ", i)
        results_query=madeCurl(i) #Array de JSON
        # Select max() from alerts
        #idAlert = makeQuery("select max(idalert) from alerta")
        #print("ID ALERT --> ",idAlert, " type --> ", type(idAlert))
        for result in results_query:
            print("\n"+str(result)+"\n")
            print("\n\n")
            s = Switcher()
            table_name, parser = s.sw_alert()
            getInserts(json.loads(json.dumps(result)), all_insert_alerts, table_name, parser, isAlert=True)
            table_name, parser = s.sw_event()
            getInserts(json.loads(json.dumps(result)), all_insert_events, table_name, parser,isAlert=False)
        #print("\n\nall_insert_alerts: ", all_insert_alerts)
        #print("\n\nall_insert_events: ", all_insert_events)
        final_insert_alerts=joinAllInserts(all_insert_alerts)
        final_insert_events=joinAllInserts(all_insert_events)
        print("\n\nfinal_insert_alerts: ",final_insert_alerts)
        #print("\n\nfinal_insert_events: ",final_insert_events)
        #Primero se hace el Insert de alerts y luego el de events ya que como esta montada la BD
        #se necesita primero que las alertas existan
        makeInsertDatabase([final_insert_alerts])
        #print("\n\nInsert 1 realizado con exito\n")
        makeInsertDatabase([final_insert_events])
        #print("\n\nInsert 2 realizado con exito")
    '''

    '''
    #Encrypt
    pwd="soar"
    # Salts should be randomly generated
    salt = os.urandom(16)
    # derive
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    key = kdf.derive(b"my great password")
    print("key --> ", key)

    # verify
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=390000,
        backend=default_backend()
    )
    kdf.verify(b"my great password", key)
    print("key --> ", key)
    '''



