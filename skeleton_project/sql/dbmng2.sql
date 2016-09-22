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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `dbmng_fields`
--

INSERT INTO `dbmng_fields` (`id_field`, `id_table`, `id_field_type`, `field_widget`, `field_name`, `field_size`, `nullable`, `readonly`, `field_note`, `default_value`, `field_label`, `field_label_long`, `field_order`, `is_searchable`, `pk`, `field_function`, `skip_in_tbl`, `voc_sql`, `param`) VALUES
(1, 1, 'int', 'input', 'id', NULL, NULL, NULL, NULL, NULL, 'ID', NULL, NULL, NULL, 1, NULL, 0, NULL, NULL),
(2, 1, 'varchar', 'textarea', 'name', NULL, 0, NULL, NULL, NULL, 'Name', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(3, 1, 'varchar', 'select', 'sex', NULL, NULL, NULL, NULL, NULL, 'Sex', NULL, NULL, NULL, NULL, NULL, 0, NULL, '{''voc_val'':{''M'':''Male'',''F'':''Female''}}'),
(4, 1, 'int', 'input', 'true_false', NULL, 0, NULL, NULL, NULL, 'True/False', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(5, 1, 'varchar', 'file', 'file', NULL, NULL, NULL, NULL, NULL, 'File', NULL, NULL, NULL, NULL, NULL, 0, NULL, '{''weburl_file'':''/dbmng2/files/'',''server_path'':''/var/www/dbmng2/files/''}'),
(6, 2, 'int', 'input', 'id_child', NULL, NULL, NULL, NULL, NULL, 'ID', NULL, NULL, NULL, 1, NULL, 0, NULL, NULL),
(7, 2, 'varchar', 'input', 'child_name', NULL, NULL, NULL, NULL, NULL, 'Child Name', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
(8, 3, 'int', 'input', 'id', NULL, NULL, NULL, NULL, NULL, 'ID', NULL, NULL, NULL, 1, NULL, 0, NULL, NULL),
(9, 3, 'varchar', 'input', 'name', NULL, 0, NULL, NULL, NULL, 'Name', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dump dei dati per la tabella `dbmng_tables`
--

INSERT INTO `dbmng_tables` (`id_table`, `id_table_type`, `table_name`, `table_desc`, `table_label`, `table_alias`, `param`) VALUES
(1, 1, 'test', NULL, NULL, NULL, NULL),
(2, 1, 'test_child', NULL, NULL, NULL, NULL),
(3, 1, 'test', NULL, NULL, 'test_simple', '{''filters'':{''sex'':''F''}}');

-- --------------------------------------------------------

--
-- Struttura della tabella `dbmng_users`
--

CREATE TABLE `dbmng_users` (
  `uid` int(10) UNSIGNED NOT NULL COMMENT 'Primary Key: Unique user ID.',
  `name` varchar(60) NOT NULL DEFAULT '' COMMENT 'Unique user name.',
  `pass` varchar(128) NOT NULL DEFAULT '' COMMENT 'User’s password (hashed).',
  `mail` varchar(254) DEFAULT '' COMMENT 'User’s e-mail address.'
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
