-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Creato il: Set 21, 2016 alle 16:09
-- Versione del server: 5.5.52-0ubuntu0.14.04.1
-- Versione PHP: 5.5.9-1ubuntu4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbmng2`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `dbmng_fields`
--

CREATE TABLE `dbmng_fields` (
  `id_field` bigint(20) UNSIGNED NOT NULL,
  `id_table` int(11) DEFAULT NULL COMMENT 'Unique table ID',
  `id_field_type` varchar(11) NOT NULL,
  `field_widget` varchar(50) NOT NULL,
  `field_name` char(50) NOT NULL,
  `field_size` int(11) DEFAULT NULL,
  `nullable` int(11) DEFAULT NULL,
  `readonly` int(11) DEFAULT NULL,
  `field_note` text,
  `default_value` char(100) DEFAULT NULL,
  `field_label` varchar(100) DEFAULT NULL,
  `field_label_long` varchar(100) DEFAULT NULL,
  `field_order` int(11) DEFAULT NULL,
  `is_searchable` int(11) DEFAULT NULL,
  `pk` int(1) DEFAULT '0',
  `field_function` varchar(100) DEFAULT NULL,
  `skip_in_tbl` int(11) DEFAULT '0',
  `voc_sql` text,
  `param` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `dbmng_fields`
--

INSERT INTO `dbmng_fields` (`id_field`, `id_table`, `id_field_type`, `field_widget`, `field_name`, `field_size`, `nullable`, `readonly`, `field_note`, `default_value`, `field_label`, `field_label_long`, `field_order`, `is_searchable`, `pk`, `field_function`, `skip_in_tbl`, `voc_sql`, `param`) VALUES
(1, 1, 'int', 'input', 'id_table', NULL, 1, 1, '', '', 'ID', '', 10, 0, 1, '', 0, '', ''),
(2, 1, 'varchar', 'input', 'table_name', NULL, 0, 0, '', '', 'Table name', '', 30, 0, 0, '', 0, '', ''),
(3, 1, 'varchar', 'input', 'table_desc', NULL, 1, 0, '', '', 'Table desc', '', 40, 0, 0, '', 1, '', ''),
(4, 1, 'varchar', 'input', 'table_label', NULL, 1, 0, NULL, NULL, 'Table label', NULL, 50, 0, 0, NULL, 0, NULL, NULL),
(5, 1, 'varchar', 'input', 'table_alias', NULL, 1, NULL, NULL, NULL, 'Table alias', NULL, 60, 0, 0, NULL, 0, NULL, NULL),
(6, 1, 'varchar', 'textarea', 'param', NULL, 1, 0, '', '', 'Param', '', 70, 0, 0, '', 1, '', ''),
(7, 2, 'int', 'input', 'id_field', NULL, 1, 1, '', '', 'ID', '', 10, 0, 1, '', 0, '', ''),
(8, 2, 'int', 'hidden', 'id_table', NULL, 1, 0, '', '', 'ID Table', '', 20, 0, 0, '', 0, '', ''),
(9, 2, 'varchar', 'input', 'field_name', NULL, 0, 0, NULL, NULL, 'Name', NULL, 21, 0, 0, NULL, 0, NULL, NULL),
(10, 2, 'varchar', 'input', 'field_label', NULL, 0, 0, '', '', 'Label', '', 22, 0, 0, '', 0, '', ''),
(11, 2, 'varchar', 'select', 'id_field_type', NULL, 0, 0, '', '', 'Type', '', 30, 0, 0, '', 0, '', '{''voc_val'':{''int'':''Integer'', ''double'':''Double'', ''varchar'':''Short Text'', ''text'':''Long Text'', ''date'':''Date''}}'),
(12, 2, 'varchar', 'select', 'field_widget', NULL, 0, 0, NULL, NULL, 'Widget', NULL, 40, 0, 0, NULL, 0, NULL, '{\r\n  ''voc_val'': {\r\n    ''checkbox'': ''CheckBox'',\r\n   ''date'': ''Date'',\r\n   ''datetime'': ''Date time'',\r\n    ''time'': ''Time'',\r\n   ''file'': ''File'',\r\n   ''html'': ''Html'',\r\n   ''picture'': ''Picture'',\r\n   ''input'': ''Input Box'',\r\n   ''hidden'': ''Hidden'',\r\n   ''numeric'': ''Numeric'',\r\n   ''password'': ''Password'',\r\n   ''select'': ''Select'',\r\n   ''select_nm'': ''Select nm'',\r\n   ''autocomplete'': ''Autocomplete'',\r\n   ''multiselect'': ''Multi-Select'',\r\n    ''textarea'': ''Text Area'',\r\n    ''geo'': ''GEO Widget''\r\n }\r\n}'),
(13, 2, 'int', 'input', 'field_size', NULL, 1, 0, NULL, NULL, 'Field size', NULL, 60, 0, 0, NULL, 1, NULL, NULL),
(14, 2, 'int', 'select', 'nullable', NULL, 1, 0, '', '', 'Nullable', 'Can be empty?', 70, 0, 0, '', 0, '', '{''voc_val'': {''0'': ''No'', ''1'': ''Yes''}}'),
(15, 2, 'int', 'checkbox', 'readonly', NULL, 1, 0, '', '', 'Readonly', '', 80, 0, 0, '', 1, '', ''),
(16, 2, 'varchar', 'input', 'field_note', NULL, 1, 0, '', '', 'Field note', '', 90, 0, 0, '', 1, '', ''),
(17, 2, 'varchar', 'input', 'default_value', NULL, 1, 0, NULL, NULL, 'Default value', NULL, 100, 0, 0, NULL, 1, NULL, NULL),
(18, 2, 'varchar', 'input', 'field_label_long', NULL, 1, 0, NULL, NULL, 'Field label long', NULL, 120, 0, 0, NULL, 1, NULL, NULL),
(19, 2, 'int', 'input', 'field_order', NULL, 1, 0, NULL, NULL, 'Order', NULL, 130, 0, 0, NULL, 0, NULL, NULL),
(20, 2, 'int', 'checkbox', 'is_searchable', NULL, 1, 0, '', '', 'Is searchable', '', 140, 0, 0, '', 1, '', ''),
(21, 2, 'int', 'select', 'pk', NULL, 0, 0, '', '', 'Pk', '', 150, 0, 0, '', 0, '', '{''voc_val'' : {''0'' : ''Normal field'',''1'' : ''Auto-increment primary key'',''2'' : ''Standard primary key''}}'),
(22, 2, 'varchar', 'hidden', 'field_function', NULL, 1, 0, '', '', 'Field function', '', 160, 0, 0, '', 1, '', ''),
(23, 2, 'int', 'checkbox', 'skip_in_tbl', NULL, 1, 0, '', '', 'Skip in tbl', '', 170, 0, 0, '', 1, '', ''),
(24, 2, 'varchar', 'textarea', 'voc_sql', NULL, 1, 0, '', '', 'Voc sql', '', 180, 0, 0, '', 1, '', ''),
(25, 2, 'text', 'textarea', 'param', NULL, 1, 0, '', '', 'Param', '', 190, 0, 0, '', 1, '', '');

-- --------------------------------------------------------

--
-- Struttura della tabella `dbmng_role`
--

CREATE TABLE `dbmng_role` (
  `rid` int(10) UNSIGNED NOT NULL COMMENT 'Primary Key: Unique role ID.',
  `name` varchar(64) NOT NULL DEFAULT '' COMMENT 'Unique role name.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores user roles.';

--
-- Dump dei dati per la tabella `dbmng_role`
--

INSERT INTO `dbmng_role` (`rid`, `name`) VALUES
(3, 'administrator'),
(1, 'anonymous user'),
(2, 'authenticated user');

-- --------------------------------------------------------

--
-- Struttura della tabella `dbmng_tables`
--

CREATE TABLE `dbmng_tables` (
  `id_table` bigint(20) UNSIGNED NOT NULL,
  `id_table_type` int(11) DEFAULT '1',
  `table_name` char(50) DEFAULT NULL,
  `table_desc` text,
  `table_label` text,
  `table_alias` varchar(100) DEFAULT NULL,
  `param` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `dbmng_tables`
--

INSERT INTO `dbmng_tables` (`id_table`, `id_table_type`, `table_name`, `table_desc`, `table_label`, `table_alias`, `param`) VALUES
(1, 1, 'dbmng_tables', 'Dbmng table', 'Dbmng Tables', '', '{  ''access'': {    ''select'': [''administrator''],    ''insert'': [''administrator''],    ''update'': [''administrator''],    ''delete'': [''administrator'']  }}'),
(2, 1, 'dbmng_fields', '', 'Dbmng Fields', '', '{''tbl_order'':''field_order''}');

-- --------------------------------------------------------

--
-- Struttura della tabella `dbmng_users`
--

CREATE TABLE `dbmng_users` (
  `uid` int(10) UNSIGNED NOT NULL COMMENT 'Primary Key: Unique user ID.',
  `name` varchar(60) NOT NULL DEFAULT '' COMMENT 'Unique user name.',
  `pass` varchar(128) NOT NULL DEFAULT '' COMMENT 'User’s password (hashed).',
  `mail` varchar(254) DEFAULT '' COMMENT 'User’s e-mail address.',
  `realname` varchar(254) DEFAULT 'Real name of the user',
  `realsurname` varchar(254) DEFAULT 'Real surname if the user',
  `description` varchar(254) DEFAULT 'Description'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Stores user data.';

--
-- Dump dei dati per la tabella `dbmng_users`
--

INSERT INTO `dbmng_users` (`uid`, `name`, `pass`, `mail`) VALUES
(1, 'test', '098f6bcd4621d373cade4e832627b4f6', '');

-- --------------------------------------------------------

--
-- Struttura della tabella `dbmng_users_roles`
--

CREATE TABLE `dbmng_users_roles` (
  `uid` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Primary Key: dbmng_users.uid for user.',
  `rid` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT 'Primary Key: dbmng_role.rid for role.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Maps users to roles.';

--
-- Dump dei dati per la tabella `dbmng_users_roles`
--

INSERT INTO `dbmng_users_roles` (`uid`, `rid`) VALUES
(1, 1);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `dbmng_fields`
--
ALTER TABLE `dbmng_fields`
  ADD PRIMARY KEY (`id_field`),
  ADD UNIQUE KEY `id_field` (`id_field`),
  ADD UNIQUE KEY `table_fieldname` (`id_table`,`field_name`);

--
-- Indici per le tabelle `dbmng_role`
--
ALTER TABLE `dbmng_role`
  ADD PRIMARY KEY (`rid`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indici per le tabelle `dbmng_tables`
--
ALTER TABLE `dbmng_tables`
  ADD PRIMARY KEY (`id_table`),
  ADD UNIQUE KEY `id_table` (`id_table`);

--
-- Indici per le tabelle `dbmng_users`
--
ALTER TABLE `dbmng_users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `mail` (`mail`);

--
-- Indici per le tabelle `dbmng_users_roles`
--
ALTER TABLE `dbmng_users_roles`
  ADD PRIMARY KEY (`uid`,`rid`),
  ADD KEY `rid` (`rid`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `dbmng_fields`
--
ALTER TABLE `dbmng_fields`
  MODIFY `id_field` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT per la tabella `dbmng_role`
--
ALTER TABLE `dbmng_role`
  MODIFY `rid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique role ID.', AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT per la tabella `dbmng_tables`
--
ALTER TABLE `dbmng_tables`
  MODIFY `id_table` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT per la tabella `dbmng_users`
--
ALTER TABLE `dbmng_users`
  MODIFY `uid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key: Unique user ID.', AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
