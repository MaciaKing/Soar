/*\c soardatabase;
REASSIGN OWNED BY soar TO postgres;
DROP OWNED BY soar;
DROP USER soar;
*/

DROP DATABASE SoarDatabase;
CREATE DATABASE SoarDatabase;
\c soardatabase;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO soar;
/* grant usage on all sequences in schema public to <myuser> */
CREATE TABLE Alert(
    /*preview BOOLEAN,
    _offset INTEGER, 
    _bkt VARCHAR(100),
    _cd VARCHAR(100),
    _indextime VARCHAR(100),
    _kv INTEGER,
    _raw VARCHAR(500),
    _serial INTEGER ,
    _si text[], 
    _sourcetype VARCHAR(20),
    _time TIMESTAMP,
    _time VARCHAR(30),
    action VARCHAR(20),
    host VARCHAR(30), 
    index VARCHAR(20),
    linecount INTEGER,
    source VARCHAR(30) ,
    sourcetype VARCHAR(30), 
    splunk_server VARCHAR(30), 
    status VARCHAR(10)*/

/* alerts = {"preview", "_offset", "_bkt", "_cd", "_indextime", "_kv", "_raw", "_serial", "_sourcetype", "_time", "action", "host", "index", "linecount", "source", "sourcetype", "splunk_server", "status"} */
/* {'_bkt', '_cd'', '_indextime', '_kv', '_raw', '_serial', '_si', '_sourcetype', '_time', 'action', 'host', 'index', 'linecount', 'source', 'sourcetype', 'splunk_server', 'status'} */   
    preview text,
    _offset text,
    _bkt text,
    _cd text,
    _indextime text,
    _kv text,
    _raw text,
    _serial text,
    /*_si text[], */
    _si text[],
    action text,
    _sourcetype text,
    _time text,
    host text,
    index text,
    linecount text,
    source text ,
    sourcetype text,
    splunk_server text,
    status text 
);




CREATE TABLE event (
	incident_id text,
	fields__raw text,
	fields_EventCode text,
	fields__time text,
	fields_action text,
	fields_app text,
	fields_cat text,
	fields_catdesc text,
	fields_category text,
 	fields_conn_count text,
	fields_date text,
	fields_dest_ip text,
	fields_dest_port text,
	fields_devname text,
	fields_diff_deviation text,
	fields_eventtype text,
	fields_host text,
	fields_index text,
	fields_level text,
	fields_msg text,
	fields_severity text,
	fields_signature text,
	fields_source text,
	fields_source_ip text,
	fields_src_ip text,
	fields_src_user text,
	fields_srcintf text,
	fields_subtype text,
	fields_ta_windows_action text,
	fields_time text,
	fields_type text,
	fields_urgency text,
	fields_url text,
	fields_user text,
	host text,
	index text,
	tag text
);

