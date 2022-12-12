
CREATE DATABASE prueba;
\c prueba;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO soar;
-- grant usage on all sequences in schema public to <myuser> 


CREATE TABLE usr(
	idUser serial PRIMARY KEY,
	name VARCHAR(30)
);

INSERT INTO usr(name) VALUES ('Unassigned'), ('Macia Salva'), ('Arnau Bartres'), ('Adrian Bustamante');

CREATE TABLE alerta(
        idAlert serial,
	incident_id text PRIMARY KEY,
	alert_time text,
        alert text,
        status text,
        index_ text,
        host text,
        tag text,
	comment_ text,
	idUser integer,
	urgency text,
	FOREIGN KEY(idUser) REFERENCES usr(idUser)
);

INSERT INTO alerta(incident_id, alert, status, index_, host, comment_, tag, idUser) VALUES ( 'incident_id', 'title', 'status', 'index_', 'host', 'comment_', 'tag',1); 

CREATE TABLE event (
	--idEvent SERIAL PRIMARY KEY,
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
	--fields{}.srcip, fields{}.vlan_dst, fields{}.vlan_src, fields{}.dstip, fields{}.index, fields{}.score
	fields_srcip text,
	fields_vlan_dst text,
	fields_vlan_src text,
	fields_dstip text,
	fields_index text, 
	fields_score text,
        fields_user text,
	FOREIGN KEY(incident_id) REFERENCES alerta(incident_id)
);


-- Declaram functions i triggers
--CREATE OR REPLACE FUNCTION setNewAlert()
  --RETURNS trigger AS
  -- RETURNS TRIGGER AS
--$$
--BEGIN
--    UPDATE alerta SET status = 'new' WHERE status IS NULL;
--    RETURN OLD;
--END;
--$$
--LANGUAGE 'plpgsql';

--CREATE TRIGGER trigger_setNewAlert AFTER INSERT ON alerta
--     FOR EACH ROW EXECUTE PROCEDURE setNewAlert();



-- Donam permisos a l'usuari
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO soar; 
GRANT ALL PRIVILEGES ON DATABASE prueba TO soar;
GRANT ALL PRIVILEGES ON TABLE usr TO soar;
GRANT ALL PRIVILEGES ON TABLE alerta TO soar;
GRANT ALL PRIVILEGES ON TABLE event TO soar;


