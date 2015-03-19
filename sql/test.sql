CREATE TABLE `dbmng2`.`test` (
  `id` INTEGER  NOT NULL,
  `name` VARCHAR(255)  NOT NULL,
  PRIMARY KEY (`id`)
);
ALTER TABLE `test` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;


-----------------------------------------------------------
-- add n_m tables - 2014-03-19
-----------------------------------------------------------
CREATE TABLE `dbmng2`.`test_father` (
  `id_father` INTEGER  NOT NULL AUTO_INCREMENT,
  `check_field` INTEGER  NOT NULL,
  `varchar_field` VARCHAR(255)  NOT NULL,
  `select_field` INTEGER  NOT NULL,
  PRIMARY KEY (`id_father`)
);

CREATE TABLE `dbmng2`.`test_child` (
  `id_child` INTEGER  NOT NULL AUTO_INCREMENT,
  `child_name` VARCHAR(255)  NOT NULL,
  PRIMARY KEY (`id_child`)
);

CREATE TABLE `dbmng2`.`test_father_child` (
  `id_father_child` INTEGER  NOT NULL AUTO_INCREMENT,
  `id_father` INTEGER  NOT NULL,
  `id_child` INTEGER  NOT NULL,
  PRIMARY KEY (`id_father_child`)
);
ALTER TABLE `dbmng2`.`test_father` ADD COLUMN `date_field` DATE  NOT NULL AFTER `select_field`;
ALTER TABLE `dbmng2`.`test_father` MODIFY COLUMN `date_field` DATE  DEFAULT NULL;

