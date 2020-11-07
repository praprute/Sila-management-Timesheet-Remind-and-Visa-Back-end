-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema sila-management
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema sila-management
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sila-management` DEFAULT CHARACTER SET utf8mb4 ;
USE `sila-management` ;

-- -----------------------------------------------------
-- Table `sila-management`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sila-management`.`users` (
  `idusers` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `role` INT NOT NULL DEFAULT 0,
  `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idusers`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sila-management`.`works`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sila-management`.`works` (
  `idworks` INT NOT NULL AUTO_INCREMENT,
  `idUser` INT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `TravelTime` DATETIME NOT NULL,
  `EndTravelTime` DATETIME NOT NULL,
  `StartTime` DATETIME NOT NULL,
  `FinishTime` DATETIME NOT NULL,
  `partner` VARCHAR(45) NOT NULL,
  `description` VARCHAR(300) NULL,
  `expenses` DOUBLE NOT NULL,
  `cost` DOUBLE NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `x` VARCHAR(100) NOT NULL,
  `y` VARCHAR(100) NOT NULL,
  `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idworks`),
  INDEX `idClient_idx` (`idUser` ASC),
  CONSTRAINT `idClient`
    FOREIGN KEY (`idUser`)
    REFERENCES `sila-management`.`users` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sila-management`.`Reminder`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sila-management`.`Reminder` (
  `idReminder` INT NOT NULL AUTO_INCREMENT,
  `idUserRemind` INT NOT NULL,
  `img` BLOB NOT NULL,
  `date` DATETIME NOT NULL,
  `notiDate3` DATETIME NOT NULL,
  `notiDate2` DATETIME NOT NULL,
  `notiDate1` DATETIME NOT NULL,
  `description` VARCHAR(300) NULL,
  `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idReminder`),
  INDEX `idClientRemind_idx` (`idUserRemind` ASC),
  CONSTRAINT `idClientRemind`
    FOREIGN KEY (`idUserRemind`)
    REFERENCES `sila-management`.`users` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sila-management`.`RemindVisa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sila-management`.`RemindVisa` (
  `idRemindVisa` INT NOT NULL AUTO_INCREMENT,
  `idUserVisa` INT NOT NULL,
  `img` BLOB NOT NULL,
  `cost` DOUBLE NOT NULL,
  `date` DATETIME NOT NULL,
  `notiDate3` DATETIME NOT NULL,
  `notiDate2` DATETIME NOT NULL,
  `notiDate1` DATETIME NOT NULL,
  `description` VARCHAR(300) NULL,
  `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idRemindVisa`),
  INDEX `idClientVisa_idx` (`idUserVisa` ASC),
  CONSTRAINT `idClientVisa`
    FOREIGN KEY (`idUserVisa`)
    REFERENCES `sila-management`.`users` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
