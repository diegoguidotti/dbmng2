
CREATE TABLE dbmng_tables
(
  id_table serial NOT NULL,
  id_table_type integer NULL DEFAULT  1,
  table_name VARCHAR(250),
  table_desc text,
  table_label text,
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
  field_label_long VARCHAR( 100 ) NOT NULL,
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


INSERT INTO dbmng_role (rid, name) VALUES
(1, 'anonymous user'),

(2, 'authenticated user'),
(3, 'administrator');

