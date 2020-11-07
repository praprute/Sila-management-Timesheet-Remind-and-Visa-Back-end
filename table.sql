-- -- MySQL Workbench Forward Engineering

-- SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
-- SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
-- SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -- -----------------------------------------------------
-- -- Schema mydb
-- -- -----------------------------------------------------
-- -- -----------------------------------------------------
-- -- Schema sila-management
-- -- -----------------------------------------------------

-- -- -----------------------------------------------------
-- -- Schema sila-management
-- -- -----------------------------------------------------
-- CREATE SCHEMA IF NOT EXISTS `sila-management` DEFAULT CHARACTER SET utf8mb4 ;
-- USE `sila-management` ;

-- -- -----------------------------------------------------
-- -- Table `sila-management`.`users`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `sila-management`.`users` (
--   `idusers` INT(11) NOT NULL AUTO_INCREMENT,
--   `email` VARCHAR(45) NOT NULL,
--   `password` VARCHAR(45) NOT NULL,
--   `name` VARCHAR(100) NOT NULL,
--   `status` INT(11) NOT NULL DEFAULT 0,
--   `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
--   PRIMARY KEY (`idusers`))
-- ENGINE = InnoDB
-- DEFAULT CHARACTER SET = utf8mb4;


-- -- -----------------------------------------------------
-- -- Table `sila-management`.`remind-visa`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `sila-management`.`remind-visa` (
--   `idremind-visa` INT(11) NOT NULL AUTO_INCREMENT,
--   `idVisaUser` INT NOT NULL,
--   `img` BLOB NOT NULL,
--   `cost` DOUBLE NOT NULL DEFAULT 0,
--   `date` DATETIME NOT NULL,
--   `notiDate3` DATETIME NOT NULL,
--   `notiDate2` DATETIME NOT NULL,
--   `notiDate1` DATETIME NOT NULL,
--   `description` VARCHAR(300) NULL DEFAULT NULL,
--   `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
--   PRIMARY KEY (`idremind-visa`),
--   INDEX `idVisaUser_idx` (`idVisaUser` ASC),
--   CONSTRAINT `idVisaUser`
--     FOREIGN KEY (`idVisaUser`)
--     REFERENCES `sila-management`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB
-- DEFAULT CHARACTER SET = utf8mb4;


-- -- -----------------------------------------------------
-- -- Table `sila-management`.`reminder`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `sila-management`.`reminder` (
--   `idreminder` INT(11) NOT NULL AUTO_INCREMENT,
--   `idUser` INT NOT NULL,
--   `img` BLOB NOT NULL,
--   `date` DATETIME NOT NULL,
--   `notiDate3` DATETIME NOT NULL,
--   `notiDate2` DATETIME NOT NULL,
--   `notiDate1` DATETIME NOT NULL,
--   `description` VARCHAR(300) NULL DEFAULT NULL,
--   `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
--   PRIMARY KEY (`idreminder`),
--   INDEX `idRemindUser_idx` (`idUser` ASC),
--   CONSTRAINT `idRemindUser`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `sila-management`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB
-- DEFAULT CHARACTER SET = utf8mb4;


-- -- -----------------------------------------------------
-- -- Table `sila-management`.`works`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `sila-management`.`works` (
--   `idworks` INT(11) NOT NULL AUTO_INCREMENT,
--   `idUser` INT NOT NULL,
--   `client` VARCHAR(100) NOT NULL,
--   `status` VARCHAR(100) NOT NULL,
--   `TravelTime` DATETIME NOT NULL,
--   `EndTravelTime` DATETIME NOT NULL,
--   `StartTime` DATETIME NOT NULL,
--   `FinishTime` DATETIME NOT NULL,
--   `partner` VARCHAR(45) NOT NULL,
--   `description` VARCHAR(300) NULL DEFAULT NULL,
--   `expenses` DOUBLE NOT NULL DEFAULT 0,
--   `cost` DOUBLE NOT NULL DEFAULT 0,
--   `location` VARCHAR(100) NOT NULL,
--   `x` VARCHAR(100) NOT NULL,
--   `y` VARCHAR(100) NOT NULL,
--   `TimeStamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
--   PRIMARY KEY (`idworks`),
--   INDEX `idClient_idx` (`idUser` ASC),
--   CONSTRAINT `idClient`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `sila-management`.`users` (`idusers`)
--     ON DELETE NO ACTION
--     ON UPDATE NO ACTION)
-- ENGINE = InnoDB
-- DEFAULT CHARACTER SET = utf8mb4;


-- SET SQL_MODE=@OLD_SQL_MODE;
-- SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
-- -- 