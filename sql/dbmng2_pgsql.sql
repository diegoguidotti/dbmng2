
CREATE TABLE dbmng_tables
(
  id_table serial NOT NULL,
  id_table_type integer NULL DEFAULT  1,
  table_name VARCHAR(250),
  table_desc text,
  table_label text,
  table_alias character varying(100),
  param text,
  CONSTRAINT id_table PRIMARY KEY (id_table),
  CONSTRAINT table_name UNIQUE (table_name)
);

CREATE TABLE dbmng_fields
(
  id_field serial NOT NULL,
  id_table integer,
  id_field_type VARCHAR(250) NOT NULL,
  field_widget VARCHAR(255) ,
  field_name VARCHAR(255) NOT NULL,
  field_size integer,
  nullable integer,
  readonly integer,
  field_note text,
  default_value VARCHAR(255),
  field_label VARCHAR(255),
  field_label_long VARCHAR(100),
  field_order integer,
  is_searchable integer,
  pk integer DEFAULT 0,
  field_function varchar(255) DEFAULT NULL,
  skip_in_tbl integer DEFAULT 0,
  voc_sql VARCHAR ( 255 ),
  param text,
  is_sercheable int default 0,
  CONSTRAINT id_field PRIMARY KEY (id_field),
  CONSTRAINT table_fieldname UNIQUE (id_table, field_name)
);

CREATE TABLE dbmng_role
(
	rid serial NOT NULL,
	name VARCHAR(65),
   CONSTRAINT dbmng_role_rid PRIMARY KEY (rid)
);

CREATE TABLE dbmng_users
(
  uid serial NOT NULL,
  name varchar(60) NOT NULL,
  pass varchar(128) NOT NULL,
  mail varchar(254) DEFAULT '',
  realname varchar(254) DEFAULT '',
  realsurname varchar(254) DEFAULT '',
  description varchar(254) DEFAULT '',
  CONSTRAINT dbmng_users_uid PRIMARY KEY (uid),
  CONSTRAINT dbmng_users_name UNIQUE (name)
);

CREATE TABLE dbmng_users_roles
(
	uid integer NOT NULL,
	rid integer NOT NULL,
   CONSTRAINT dbmng_users_roles_pk PRIMARY KEY (uid,rid)
);

-- 
-- Insert in the tables default values
-- 
INSERT INTO dbmng_users (uid, name, pass, mail) VALUES (1, 'test', '098f6bcd4621d373cade4e832627b4f6', '');


INSERT INTO dbmng_role (rid, name) VALUES
(1, 'anonymous user'),
(2, 'authenticated user'),
(3, 'administrator');

INSERT INTO dbmng_tables VALUES (1, 1, 'dbmng_tables', 'Dbmng table', 'Dbmng Tables', '', '{  ''access'': {    ''select'': [''administrator''],    ''insert'': [''administrator''],    ''update'': [''administrator''],    ''delete'': [''administrator'']  }}');
INSERT INTO dbmng_tables VALUES (2, 1, 'dbmng_fields', '', 'Dbmng Fields', '', '{''tbl_order'':''field_order''}');

INSERT INTO dbmng_fields VALUES (1, 1, 'int', 'input', 'id_table', NULL, 1, 1, '', '', 'ID', '', 10, 0, 1, '', 0, '', '', 0);
INSERT INTO dbmng_fields VALUES (2, 1, 'varchar', 'input', 'table_name', NULL, 0, 0, '', '', 'Table name', '', 30, 0, 0, '', 0, '', '', 0);
INSERT INTO dbmng_fields VALUES (3, 1, 'varchar', 'input', 'table_desc', NULL, 1, 0, '', '', 'Table desc', '', 40, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (4, 1, 'varchar', 'input', 'table_label', NULL, 1, 0, NULL, NULL, 'Table label', NULL, 50, 0, 0, NULL, 0, NULL, NULL, 0);
INSERT INTO dbmng_fields VALUES (5, 1, 'varchar', 'input', 'table_alias', NULL, 1, NULL, NULL, NULL, 'Table alias', NULL, 60, 0, 0, NULL, 0, NULL, NULL, 0);
INSERT INTO dbmng_fields VALUES (6, 1, 'varchar', 'textarea', 'param', NULL, 1, 0, '', '', 'Param', '', 70, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (7, 2, 'int', 'input', 'id_field', NULL, 1, 1, '', '', 'ID', '', 10, 0, 1, '', 0, '', '', 0);
INSERT INTO dbmng_fields VALUES (8, 2, 'int', 'hidden', 'id_table', NULL, 1, 0, '', '', 'ID Table', '', 20, 0, 0, '', 0, '', '', 0);
INSERT INTO dbmng_fields VALUES (9, 2, 'varchar', 'input', 'field_name', NULL, 0, 0, NULL, NULL, 'Name', NULL, 21, 0, 0, NULL, 0, NULL, NULL, 0);
INSERT INTO dbmng_fields VALUES (10, 2, 'varchar', 'input', 'field_label', NULL, 0, 0, '', '', 'Label', '', 22, 0, 0, '', 0, '', '', 0);
INSERT INTO dbmng_fields VALUES (11, 2, 'varchar', 'select', 'id_field_type', NULL, 0, 0, '', '', 'Type', '', 30, 0, 0, '', 0, '', '{''voc_val'':{''int'':''Integer'', ''double'':''Double'', ''varchar'':''Short Text'', ''text'':''Long Text'', ''date'':''Date''}}', 0);
INSERT INTO dbmng_fields VALUES (13, 2, 'int', 'input', 'field_size', NULL, 1, 0, NULL, NULL, 'Field size', NULL, 60, 0, 0, NULL, 1, NULL, NULL, 0);
INSERT INTO dbmng_fields VALUES (14, 2, 'int', 'select', 'nullable', NULL, 1, 0, '', '', 'Nullable', 'Can be empty?', 70, 0, 0, '', 0, '', '{''voc_val'': {''0'': ''No'', ''1'': ''Yes''}}', 0);
INSERT INTO dbmng_fields VALUES (15, 2, 'int', 'checkbox', 'readonly', NULL, 1, 0, '', '', 'Readonly', '', 80, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (16, 2, 'varchar', 'input', 'field_note', NULL, 1, 0, '', '', 'Field note', '', 90, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (18, 2, 'varchar', 'input', 'field_label_long', NULL, 1, 0, NULL, NULL, 'Field label long', NULL, 120, 0, 0, NULL, 1, NULL, NULL, 0);
INSERT INTO dbmng_fields VALUES (19, 2, 'int', 'input', 'field_order', NULL, 1, 0, NULL, NULL, 'Order', NULL, 130, 0, 0, NULL, 0, NULL, NULL, 0);
INSERT INTO dbmng_fields VALUES (20, 2, 'int', 'checkbox', 'is_searchable', NULL, 1, 0, '', '', 'Is searchable', '', 140, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (21, 2, 'int', 'select', 'pk', NULL, 0, 0, '', '', 'Pk', '', 150, 0, 0, '', 0, '', '{''voc_val'' : {''0'' : ''Normal field'',''1'' : ''Auto-increment primary key'',''2'' : ''Standard primary key''}}', 0);
INSERT INTO dbmng_fields VALUES (22, 2, 'varchar', 'hidden', 'field_function', NULL, 1, 0, '', '', 'Field function', '', 160, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (23, 2, 'int', 'checkbox', 'skip_in_tbl', NULL, 1, 0, '', '', 'Skip in tbl', '', 170, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (24, 2, 'varchar', 'textarea', 'voc_sql', NULL, 1, 0, '', '', 'Voc sql', '', 180, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (25, 2, 'text', 'textarea', 'param', NULL, 1, 0, '', '', 'Param', '', 190, 0, 0, '', 1, '', '', 0);
INSERT INTO dbmng_fields VALUES (17, 2, 'varchar', 'input', 'default_value', NULL, 1, 0, NULL, NULL, 'Default value', NULL, 100, 0, 0, NULL, 1, NULL, '', 0);
INSERT INTO dbmng_fields VALUES (12, 2, 'varchar', 'select', 'field_widget', NULL, 0, 0, NULL, NULL, 'Widget', NULL, 40, 0, 0, NULL, 0, NULL, '{
  ''voc_val'': {
    ''checkbox'': ''CheckBox'',
   ''date'': ''Date'',
   ''datetime'': ''Date time'',
    ''time'': ''Time'',
   ''file'': ''File'',
   ''html'': ''Html'',
   ''picture'': ''Picture'',
   ''input'': ''Input Box'',
   ''hidden'': ''Hidden'',
   ''numeric'': ''Numeric'',
   ''password'': ''Password'',
   ''select'': ''Select'',
   ''select_nm'': ''Select nm'',
   ''autocomplete'': ''Autocomplete'',
   ''multiselect'': ''Multi-Select'',
    ''textarea'': ''Text Area'',
    ''geo'': ''GEO Widget''
 }
}', 0);


-- Update the sequence of the tables after insert.
SELECT pg_catalog.setval('dbmng_fields_id_field_seq', 5, true);
SELECT pg_catalog.setval('dbmng_tables_id_table_seq', 30, true);
SELECT pg_catalog.setval('dbmng_role_rid_seq', 4, true);
SELECT pg_catalog.setval('dbmng_users_uid_seq', 2, true);
