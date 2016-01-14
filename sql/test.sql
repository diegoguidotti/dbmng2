CREATE TABLE `dbmng2`.`test` (
  `id` INTEGER  NOT NULL,
  `name` VARCHAR(255)   NULL,
  PRIMARY KEY (`id`)
);
ALTER TABLE `test` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;



CREATE TABLE `dbmng2`.`test_father` (
  `id_father` INTEGER  NOT NULL AUTO_INCREMENT,
  `check_field` INTEGER   NULL,
  `varchar_field` VARCHAR(255)   NULL,
  `select_field` INTEGER   NULL,
  PRIMARY KEY (`id_father`)
);

CREATE TABLE `dbmng2`.`test_child` (
  `id_child` INTEGER  NOT NULL AUTO_INCREMENT,
  `child_name` VARCHAR(255)   NULL,
  PRIMARY KEY (`id_child`)
);

CREATE TABLE `dbmng2`.`test_father_child` (
  `id_father_child` INTEGER  NOT NULL AUTO_INCREMENT,
  `id_father` INTEGER   NULL,
  `id_child` INTEGER   NULL,
  PRIMARY KEY (`id_father_child`)
);
ALTER TABLE `dbmng2`.`test_father` ADD COLUMN `date_field` DATE   NULL AFTER `select_field`;
ALTER TABLE `dbmng2`.`test_father` MODIFY COLUMN `date_field` DATE  DEFAULT NULL;

--  added to test select widget.
ALTER TABLE `test` ADD `sex` VARCHAR(20) NOT NULL AFTER `name`;
--  added to test checkbox widget.
ALTER TABLE `test` ADD `true_false` INTEGER NOT NULL AFTER `sex`;
--  added to test file widget.
ALTER TABLE `test` ADD `file` VARCHAR(255);
