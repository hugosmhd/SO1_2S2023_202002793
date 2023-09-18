CREATE DATABASE IF NOT EXISTS proyecto1;
USE proyecto1;

CREATE TABLE IF NOT EXISTS uso_cpu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    porcentaje INT,
    fecha TIMESTAMP
);

CREATE TABLE IF NOT EXISTS uso_ram (
    id INT PRIMARY KEY AUTO_INCREMENT,
    porcentaje INT,
    fecha TIMESTAMP
);

INSERT INTO uso_cpu (porcentaje, fecha) VALUES (75, NOW());
INSERT INTO uso_cpu (porcentaje, fecha) VALUES (50, NOW());
INSERT INTO uso_cpu (porcentaje, fecha) VALUES (35, NOW());
INSERT INTO uso_ram (porcentaje, fecha) VALUES (72, NOW());