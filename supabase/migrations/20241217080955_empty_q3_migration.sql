-- Create machine_monitoring_poorten table
CREATE TABLE machine_monitoring_poorten (
    id SERIAL PRIMARY KEY,
    board INT DEFAULT 0 NOT NULL,
    port INT DEFAULT 0 NOT NULL,
    name VARCHAR(255),
    volgorde INT DEFAULT 0 NOT NULL,
    visible BOOLEAN DEFAULT FALSE NOT NULL
);
 
-- Create monitoring_data_202009 table
CREATE TABLE monitoring_data_202009 (
    id SERIAL PRIMARY KEY,
    board SMALLINT DEFAULT 0 NOT NULL,
    port SMALLINT DEFAULT 0 NOT NULL,
    com SMALLINT DEFAULT 0 NOT NULL,
    code INT DEFAULT 0 NOT NULL,
    code2 INT DEFAULT 0 NOT NULL,
    timestamp TIMESTAMP(6),
    datum DATE,
    mac_address VARCHAR(50) DEFAULT '' NOT NULL,
    shot_time DOUBLE PRECISION DEFAULT 0.000000 NOT NULL,
    previous_shot_id INT DEFAULT 0 NOT NULL
);
 
-- Indexes for monitoring_data_202009
CREATE INDEX idx_board_monitoring_202009 ON monitoring_data_202009 (board);
CREATE INDEX idx_board_port_monitoring_202009 ON monitoring_data_202009 (board, port);
CREATE INDEX idx_board_port_datum_monitoring_202009 ON monitoring_data_202009 (board, port, datum);
CREATE INDEX idx_code_monitoring_202009 ON monitoring_data_202009 (code);
CREATE INDEX idx_datum_monitoring_202009 ON monitoring_data_202009 (datum);
CREATE INDEX idx_port_monitoring_202009 ON monitoring_data_202009 (port);
CREATE INDEX idx_timestamp_monitoring_202009 ON monitoring_data_202009 (timestamp);
 
-- Create monitoring_data_202010 table
CREATE TABLE monitoring_data_202010 (
    id SERIAL PRIMARY KEY,
    board SMALLINT DEFAULT 0 NOT NULL,
    port SMALLINT DEFAULT 0 NOT NULL,
    com SMALLINT DEFAULT 0 NOT NULL,
    code INT DEFAULT 0 NOT NULL,
    code2 INT DEFAULT 0 NOT NULL,
    timestamp TIMESTAMP(6),
    datum DATE,
    mac_address VARCHAR(50) DEFAULT '' NOT NULL,
    shot_time DOUBLE PRECISION DEFAULT 0.000000 NOT NULL,
    previous_shot_id INT DEFAULT 0 NOT NULL
);
 
-- Indexes for monitoring_data_202010
CREATE INDEX idx_board_monitoring_202010 ON monitoring_data_202010 (board);
CREATE INDEX idx_board_port_monitoring_202010 ON monitoring_data_202010 (board, port);
CREATE INDEX idx_board_port_datum_monitoring_202010 ON monitoring_data_202010 (board, port, datum);
CREATE INDEX idx_code_monitoring_202010 ON monitoring_data_202010 (code);
CREATE INDEX idx_datum_monitoring_202010 ON monitoring_data_202010 (datum);
CREATE INDEX idx_port_monitoring_202010 ON monitoring_data_202010 (port);
CREATE INDEX idx_timestamp_monitoring_202010 ON monitoring_data_202010 (timestamp);
 
-- Create production_data table
CREATE TABLE production_data (
    id SERIAL PRIMARY KEY,
    treeview_id INT DEFAULT 0 NOT NULL,
    treeview2_id INT DEFAULT 0 NOT NULL,
    start_date DATE DEFAULT '0001-01-01' NOT NULL,
    start_time TIME DEFAULT '00:00:00' NOT NULL,
    end_date DATE DEFAULT '0001-01-01' NOT NULL,
    end_time TIME DEFAULT '00:00:00' NOT NULL,
    amount DOUBLE PRECISION DEFAULT 0.00 NOT NULL,
    name VARCHAR(255) DEFAULT '' NOT NULL,
    description TEXT NOT NULL,
    port SMALLINT DEFAULT 0 NOT NULL,
    board SMALLINT DEFAULT 0 NOT NULL
);
 
-- Indexes for production_data
CREATE INDEX idx_board_production_data ON production_data (board);
CREATE INDEX idx_end_date_end_time_production_data ON production_data (end_date, end_time);
CREATE INDEX idx_port_production_data ON production_data (port);
CREATE INDEX idx_start_date_start_time_production_data ON production_data (start_date, start_time);
CREATE INDEX idx_treeview_id_production_data ON production_data (treeview_id);
 
-- Create tellerbasis table
CREATE TABLE tellerbasis (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) DEFAULT '' NOT NULL,
    omschrijving VARCHAR(255) DEFAULT '' NOT NULL,
    optie INT DEFAULT 0 NOT NULL,
    actief BOOLEAN NOT NULL,
    afkorting VARCHAR(255) NOT NULL,
    max_waarde DOUBLE PRECISION NOT NULL
);
 
-- Indexes for tellerbasis
CREATE INDEX idx_actief_tellerbasis ON tellerbasis (actief);
CREATE INDEX idx_naam_tellerbasis ON tellerbasis (naam);
 
-- Create tellerstanden table
CREATE TABLE tellerstanden (
    id SERIAL PRIMARY KEY,
    waarde NUMERIC(11, 2) DEFAULT 0.00 NOT NULL,
    totaal NUMERIC(11, 2) DEFAULT 0.00 NOT NULL,
    treeview_id INT DEFAULT 0 NOT NULL,
    datum INT DEFAULT 0 NOT NULL,
    tellerbasis_id INT DEFAULT 0 NOT NULL
);
 
-- Indexes for tellerstanden
CREATE INDEX idx_tellerbasis_id_tellerstanden ON tellerstanden (tellerbasis_id);
CREATE INDEX idx_treeview_id_tellerstanden ON tellerstanden (treeview_id);
 
-- Create treeview table
CREATE TABLE treeview (
    id SERIAL PRIMARY KEY,
    object CHAR(1) DEFAULT '' NOT NULL,
    naam VARCHAR(255) DEFAULT '' NOT NULL,
    omschrijving VARCHAR(255) DEFAULT '' NOT NULL,
    boom_volgorde INT DEFAULT 0 NOT NULL,
    stamkaart TEXT NOT NULL,
    treeviewtype_id INT DEFAULT 0 NOT NULL,
    serienummer VARCHAR(255) DEFAULT '' NOT NULL,
    bouwjaar VARCHAR(255) DEFAULT '' NOT NULL,
    actief BOOLEAN DEFAULT TRUE NOT NULL,
    wijzigactief INT DEFAULT 0 NOT NULL,
    vrijgegeven BOOLEAN DEFAULT FALSE NOT NULL,
    installatiedatum INT DEFAULT 0 NOT NULL,
    garantietot INT DEFAULT 0 NOT NULL,
    aanschafwaarde NUMERIC(11, 2) DEFAULT 0.00 NOT NULL,
    afschrijving INT DEFAULT 0 NOT NULL,
    jaarafschrijving INT DEFAULT 0 NOT NULL,
    afschrijvingeen SMALLINT DEFAULT 0 NOT NULL,
    budgetvorig NUMERIC(11, 2) DEFAULT 0.00 NOT NULL,
    budgetnu NUMERIC(11, 2) DEFAULT 0.00 NOT NULL,
    melden BOOLEAN DEFAULT TRUE NOT NULL,
    correctief BOOLEAN DEFAULT FALSE NOT NULL,
    werkopdracht BOOLEAN DEFAULT FALSE NOT NULL,
    fabrikanten_id INT DEFAULT 0 NOT NULL,
    leverancieren_id INT DEFAULT 0 NOT NULL,
    locaties_id INT DEFAULT 0 NOT NULL,
    kostenplaats_id INT DEFAULT 0 NOT NULL,
    parent INT DEFAULT 0 NOT NULL,
    new_id INT DEFAULT 0 NOT NULL,
    old_datum DATE DEFAULT '0001-01-01' NOT NULL
);
 
-- Indexes for treeview
CREATE INDEX idx_actief_treeview ON treeview (actief);
CREATE INDEX idx_bouwjaar_treeview ON treeview (bouwjaar);
CREATE INDEX idx_fabrikanten_id_treeview ON treeview (fabrikanten_id);
CREATE INDEX idx_locaties_id_treeview ON treeview (locaties_id);
CREATE INDEX idx_naam_treeview ON treeview (naam);
CREATE INDEX idx_serienummer_treeview ON treeview (serienummer);