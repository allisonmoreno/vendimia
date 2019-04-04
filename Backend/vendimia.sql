# ************************************************************
# Sequel Pro SQL dump
# Versión 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.5.5-10.1.32-MariaDB)
# Base de datos: vendimia
# Tiempo de Generación: 2019-04-04 09:23:58 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Volcado de tabla articulos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `articulos`;

CREATE TABLE `articulos` (
  `id_articulo` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(50) DEFAULT NULL,
  `modelo` varchar(30) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `existencia` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_articulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `articulos` WRITE;
/*!40000 ALTER TABLE `articulos` DISABLE KEYS */;

INSERT INTO `articulos` (`id_articulo`, `descripcion`, `modelo`, `precio`, `existencia`)
VALUES
	(1,'Comedor 4 sillas','Prueba',5678,5),
	(2,'Silla para comedor','Prueba 2',300,10),
	(3,'Sillón básico',NULL,1500,0);

/*!40000 ALTER TABLE `articulos` ENABLE KEYS */;
UNLOCK TABLES;


# Volcado de tabla articulos_ventas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `articulos_ventas`;

CREATE TABLE `articulos_ventas` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `id_venta` int(11) DEFAULT NULL,
  `id_articulo` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Volcado de tabla clientes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `id_cliente` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `paterno` varchar(30) DEFAULT NULL,
  `materno` varchar(30) DEFAULT NULL,
  `rfc` varchar(14) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;

INSERT INTO `clientes` (`id_cliente`, `nombre`, `paterno`, `materno`, `rfc`)
VALUES
	(1,'Allison','Moreno','Preciado','MOPA940716QB6');

/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;


# Volcado de tabla configuracion
# ------------------------------------------------------------

DROP TABLE IF EXISTS `configuracion`;

CREATE TABLE `configuracion` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `valor` float DEFAULT NULL,
  `slug` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `configuracion` WRITE;
/*!40000 ALTER TABLE `configuracion` DISABLE KEYS */;

INSERT INTO `configuracion` (`id`, `nombre`, `valor`, `slug`)
VALUES
	(1,'Tasa Financiamiento',2.8,'tasa_financiamiento'),
	(2,'% Enganche',20,'porcentaje_enganche'),
	(3,'Plazo Máximo',12,'plazo_maximo');

/*!40000 ALTER TABLE `configuracion` ENABLE KEYS */;
UNLOCK TABLES;


# Volcado de tabla ventas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ventas`;

CREATE TABLE `ventas` (
  `id_venta` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `FK_id_cliente` int(11) DEFAULT NULL,
  `total` double DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_venta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;

INSERT INTO `ventas` (`id_venta`, `FK_id_cliente`, `total`, `fecha`, `estatus`)
VALUES
	(1,1,1527,'2019-04-03 00:00:00',1);

/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
