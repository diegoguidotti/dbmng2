-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 09, 2015 alle 10:16
-- Versione del server: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.14

-- --------------------------------------------------------

--
-- Struttura della tabella dbmng_fields
--

CREATE TABLE IF NOT EXISTS dbmng_fields (
  id_field bigint(20) unsigned NOT NULL COMMENT 'Primary Key: Unique field ID.',
  id_table int(11) DEFAULT NULL COMMENT 'Unique table ID',
  id_field_type varchar(11) NOT NULL,
  field_widget varchar(50) NOT NULL,
  field_name char(50) NOT NULL,
  field_size int(11) DEFAULT NULL,
  nullable int(11) DEFAULT NULL,
  readonly int(11) DEFAULT NULL,
  field_note text,
  default_value char(100) DEFAULT NULL,
  field_label varchar(100) DEFAULT NULL,
  field_label_long varchar(100) DEFAULT NULL,
  field_order int(11) DEFAULT NULL,
  is_searchable int(11) DEFAULT NULL,
  pk int(1) DEFAULT '0',
  field_function varchar(100) DEFAULT NULL,
  skip_in_tbl int(11) DEFAULT '0',
  voc_sql text,
  param text
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struttura della tabella dbmng_tables
--

CREATE TABLE IF NOT EXISTS dbmng_tables (
  id_table bigint(20) unsigned NOT NULL COMMENT 'Primary Key: Unique table ID.',
  id_table_type int(11) DEFAULT '1',
  table_name char(50) DEFAULT NULL,
  table_desc text,
  table_label text
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struttura della tabella dbmng_role
--

CREATE TABLE IF NOT EXISTS dbmng_role (
  rid int(10) unsigned NOT NULL COMMENT 'Primary Key: Unique role ID.',
  name varchar(64) NOT NULL DEFAULT '' COMMENT 'Unique role name.'
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Stores user roles.' AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struttura della tabella dbmng_users
--

CREATE TABLE IF NOT EXISTS dbmng_users (
  uid int(10) unsigned NOT NULL COMMENT 'Primary Key: Unique user ID.',
  name varchar(60) NOT NULL DEFAULT '' COMMENT 'Unique user name.',
  pass varchar(128) NOT NULL DEFAULT '' COMMENT 'User’s password (hashed).',
  mail varchar(254) DEFAULT '' COMMENT 'User’s e-mail address.',
  realname varchar(254) DEFAULT '' COMMENT 'User’s real name.',
  realsurname varchar(254) DEFAULT '' COMMENT 'User’s real surname.',
  description varchar(254) DEFAULT '' COMMENT 'User’s description.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores user data.' AUTO_INCREMENT=1;

-- --------------------------------------------------------

--
-- Struttura della tabella dbmng_users_roles
--

CREATE TABLE IF NOT EXISTS dbmng_users_roles (
  uid int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Primary Key: dbmng_users.uid for user.',
  rid int(10) unsigned NOT NULL DEFAULT '0' COMMENT 'Primary Key: dbmng_role.rid for role.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Maps users to roles.';

--
-- Indexes for table dbmng_fields
--
ALTER TABLE dbmng_fields
 ADD PRIMARY KEY (id_field), ADD UNIQUE KEY id_field (id_field), ADD UNIQUE KEY table_fieldname (id_table,field_name);

--
-- Indexes for table dbmng_tables
--
ALTER TABLE dbmng_tables
 ADD PRIMARY KEY (id_table), ADD UNIQUE KEY id_table (id_table);

--
-- AUTO_INCREMENT for table dbmng_fields
--
ALTER TABLE dbmng_fields
MODIFY id_field bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;
--
-- AUTO_INCREMENT for table dbmng_tables
--
ALTER TABLE dbmng_tables
MODIFY id_table bigint(20) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

--
-- Indexes for table dbmng_role
--
ALTER TABLE dbmng_role
 ADD PRIMARY KEY (rid), ADD UNIQUE KEY name (name);

--
-- Indexes for table dbmng_users
--
ALTER TABLE dbmng_users
 ADD PRIMARY KEY (uid), ADD UNIQUE KEY name (name), ADD KEY mail (mail);

--
-- Indexes for table dbmng_users_roles
--
ALTER TABLE dbmng_users_roles
 ADD PRIMARY KEY (uid,rid), ADD KEY rid (rid);

--
-- AUTO_INCREMENT for table dbmng_role
--
ALTER TABLE dbmng_role
MODIFY rid int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique role ID.',AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table dbmng_users
--
ALTER TABLE dbmng_users
MODIFY uid int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique user ID.',AUTO_INCREMENT=1;


INSERT INTO `dbmng_role` (`rid`, `name`) VALUES
(1, 'anonymous user'),
(2, 'authenticated user'),
(3, 'administrator');
