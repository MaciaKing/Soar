import splunklib.client as client
import splunklib.results as results
import psycopg2
import json, xmltodict
from enum import Enum
#Encrypt
import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
    

alerts = {'_bkt': '', '_cd': '', '_indextime': '', '_kv': '', '_raw': '', '_serial': '', '_si': [''], '_sourcetype': '', '_time': '', 'action': '', 'host': '', 'index': '', 'linecount': '', 'source': '', 'sourcetype': '', 'splunk_server': '', 'status': ''}

#events = {'alert_time': '', 'fields{}.Detail': '', 'fields{}._raw': '', 'fields{}.dest_ip': '', 'fields{}.dest_port': '', 'fields{}.index': '', 'incident_id': ''}
#  alert_time | fields_detail | fields__raw | fields_dest_ip | fields_dest_port | fields_index | incident_id    DATABASE FORM

#events = {'_raw': '' , '_time' : '' , 'title' : '' , '_alert_time' : '' , 'fields__Detail' : '' , 'fields__raw' : '' , 'fields__time' : '' , 'fields__action' : '' , 'fields__app' : '' , 'fields__cat' : '' , 'fields__cat_desc' : '' , 'fields__category' : '' , 'fields__time' : '' , 'fields__date' : '' , 'fields__dest_ip' : '' , 'fields__dest_port' : '' ,  'fields__devname' : '' , 'fields__eventtype' : '' , 'fields__index' : '' , 'fields__level' : '' , 'fields__msg' : '' , 'fields__severety' : '' , 'fields__signature' : '' , 'fields__source' : '' , 'fields__source_ip' : '' ,  'fields__source' : '' , 'fields__src_ip' : '' , 'fields__src_user' : '' , 'fields__srcintf' : '' , 'fields__subtype' : '' , 'fields__ta_windows_action' : '' , 'fields__time' : '' , 'fields__type' : '' , 'fields__urgency' : '' , 'fields__url' : '' , 'fields__user' : '' , 'host' : '' , 'incident_id' : '' , 'index' : '', 'tag' : ''}

#events = {'alert_time':'','date_hour':'','date_mday':'','date_minute':'','date_month':'','date_second':'','date_wday':'', 'date_year':'','date_zone':'','eventtype':'',    'fields{}._raw': '','fields{}._time': '', 'fields{}.action': '', 'fields{}.cat': '','fields{}.catdesc': '','fields{}.category':'','fields{}.date':'','fields{}.dest_ip':'','fields{}.dest_port':'', 'fields{}.devname':'','fields{}.eventtype':'','fields{}.index':'',  'fields{}.level':'', 'fields{}.msg':'', 'fields{}.severity':'', 'fields{}.source':'', 'fields{}.src_ip':'', 'fields{}.srcintf':'', 'fields{}.subtype':'',  'fields{}.time':'', 'fields{}.type':'', 'host':'', 'incident_id':'', 'index':'', 'linecount':'', 'punct':'', 'source':'', 'sourcetype':'', 'splunk_server':'', 'splunk_server_group':'', 'tag':'', 'tag::eventtype':'', 'timeendpos':'', 'timestartpos':'', 'title':'', '_bkt':'', '_cd':'', '_eventtype_color':'', '_indextime':'', '_raw': '', '_si':'', '_sourcetype':'', '_subsecond':'', '_time':'' }

#events = {'alert_time':'','incident_id':'','alert':'','status':'','fields{}._raw':''}

events = {'incident_id':'','fields{}._raw':'','fields{}.EventCode':'','fields{}._time':'','fields{}.action':'','fields{}.app':'','fields{}.cat':'','fields{}.catdesc':'','fields{}.category':'','fields{}.conn_count':'','fields{}.date':'','fields{}.dest_ip':'','fields{}.dest_port':'','fields{}.devname':'','fields{}.diff_deviation':'','fields{}.eventtype':'','fields{}.host':'','fields{}.index':'','fields{}.level':'','fields{}.msg':'','fields{}.severity':'','fields{}.signature':'','fields{}.source':'','fields{}.source_ip':'','fields{}.src_ip':'','fields{}.src_user':'','fields{}.srcintf':'','fields{}.subtype':'','fields{}.ta_windows_action':'','fields{}.time':'','fields{}.type':'','fields{}.urgency':'','fields{}.url':'','fields{}.user':'','host':'','index':'','tag':''}


'''
# resultado de la query  --ng |table * -- 

{
'incident_id':'',
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

class Switcher():
    def sw_alert(self):
        global alerts
        return ["alert", alerts]

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
NAME_DB="soardatabase"





#All querys to search into splunk
#querys = ["search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\" AND fields{}._raw=* AND NOT alert=*Beaconing|table alert_time fields{}.Detail fields{}.Action fields{}.source  fields{}.source_ip fields{}._raw fields{}.dest_ip fields{}.dest_port fields{}.index fields{}.signature  fields{}.user incident_id tag"]

#querys = ["search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\" AND fields{}._raw=* AND NOT alert=*Beaconing |table *"]

#querys= ["search index=\"alerts_omniaccess\" AND sourcetype=\"incident_change\" status=new NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id, fields{}._raw]"]

querys=["search index=\"alerts_omniaccess\" AND sourcetype=\"incident_change\" status=new NOT alert IN (\"OA - HTTP/HTTPS Beaconing\")| table alert_time, incident_id, alert, status| join incident_id[| search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\"| fields incident_id, fields{}._raw, fields{}.EventCode, fields{}._time, fields{}.action, fields{}.app, fields{}.cat, fields{}.catdesc,  fields{}.category, fields{}.conn_count, fields{}.date, fields{}.dest_ip, fields{}.dest_port, fields{}.devname, fields{}.diff_deviation, fields{}.eventtype, fields{}.host,  fields{}.index, fields{}.level, fields{}.msg, fields{}.severity,  fields{}.signature,  fields{}.source, fields{}.source_ip,fields{}.src_ip,fields{}.src_user,fields{}.srcintf,fields{}.subtype,fields{}.ta_windows_action,fields{}.time,fields{}.type,fields{}.urgency,fields{}.url,fields{}.user,host,index,tag]"]

#querys = ["search index=\"alerts_omniaccess\" AND sourcetype=\"alert_data_results\" AND fields{}._raw=* AND NOT alert=*Beaconing| fields{}._raw"]
#querys = ["search index=alerts_omniaccess AND action=create"]
#querys = ["search `all_alerts()` | fillnull value=\"unknown\" owner, status, status_description, impact, urgency, priority, group_id | search title=\"*\" owner=\"*\" alert=\"*\" category=\"*\" subcategory=\"*\" incident_id=\"*\" group_id=\"*\"  | eval dobulkedit=incident_id, doedit=\" \", doquickassign=\" \", doaction=\" \" | join incident_id [| search index=\"alerts_omniaccess\" sourcetype=alert_data_results | fields incident_id, fields{}.index, fields{}.action, fields{}.srcip, fields{}.dstip]"]
#querys= ["search index=alerts_omniaccess sourcetype=\"alert_metadata\"| fields _time, incident_id, alert, app, category, subcategory, tags, earliest, latest, eventSearch, owner, priority, result_id, title, urgency, alert_time, display_fields| lookup incidents incident_id OUTPUT alert, title, owner, status, impact, urgency, external_reference_id, duplicate_count, alert_time as earliest_alert_time, group_id, category, subcategory, tags, display_fields| lookup incident_groups _key AS group_id OUTPUT group| lookup alert_priority impact, urgency OUTPUT priority| lookup incident_settings alert OUTPUTNEW category AS category_settings, subcategory as subcategory_setttings, tags as tags_settings, display_fields as display_fields_settings| lookup alert_status status OUTPUT status_description| dedup incident_id| eval first_seen=strftime(earliest_alert_time, \"%Y-%m-%d %H:%M:%S\"), title=if(isnull(title) OR title=\"\",alert,title), category=if(category=\"\" OR isnull(category),category_settings,category),subcategory=if(subcategory=\"\" OR isnull(subcategory),subcategory_settings,subcategory),tags=if(tags=\"\",tags_settings,tags),display_fields=if(display_fields=\"\",display_fields_settings,display_fields)| fillnull value=\"\" tags, category, subcategory| eval tags=if(tags==\"\",\"[Untagged]\",tags)| makemv delim=\" \" tags"]

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
                        "earliest_time": "-4h",
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


def getInserts(jsonToDatabase, add_insert, table_name, parser):
    '''
    Transalate a JSON to a SQL Insert, and leave insert in add_insert array    
    '''
    
    insert="INSERT INTO "+ table_name +" (" + ','.join(parser)+") values ("
    insert=transform(insert) 
    first_value_insert=True
    for key in parser.keys():
        #alerts[key]=jsonToDatabase[key]
        #print(" Value --> ",str(jsonToDatabase[key]), "Type ", type(jsonToDatabase[key]))
        try:
            #print(" Value --> ",str(jsonToDatabase[key]), "Type ", type(jsonToDatabase[key]))
            if first_value_insert:
                insert+="'"+str(jsonToDatabase[key])+"'"
                first_value_insert=False
            else:
                if type(jsonToDatabase[key]) == list:
                    insert+=", ARRAY "+str(jsonToDatabase[key])
                elif jsonToDatabase[key][0] == '<': # xml format
                    insert += ", '" +str(jsonToDatabase[key]).replace("'","")+"'"
                    None
                else:
                    insert+=", '"+str(jsonToDatabase[key])+"'"
        except:
            insert+= ",' '" #This var is not found on javascript
    insert+=")"
    #print(insert)
    add_insert.append(insert)


def joinAllInserts(all_inserts):
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
    return final_insert    


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
        print(i)
        cur.execute(insert)

    cur = conn.cursor()
    conn.commit()
    cur.close()


all_insert_alerts=[]
all_insert_events=[]
### MAIN ###
if __name__ == "__main__":
    #Made all querys to Splunk search
    
    for i in querys:
        print("QUERY: ", i)
        results_query=madeCurl(i) #Array de JSON
        for result in results_query:
           # print("\n"+str(result)+"\n")
            print("\n\n")
            s = Switcher()
            table_name, parser = s.sw_event()
            #table_name, parser = s.sw_alert()
            #print("table_name ----> ", type(table_name), type(parser))
            getInserts(json.loads(json.dumps(result)), all_insert_alerts, table_name, parser)
        final_insert_alerts=joinAllInserts(all_insert_alerts)
        print(final_insert_alerts)
        makeInsertDatabase([final_insert_alerts])
    

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



