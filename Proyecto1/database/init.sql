CREATE DATABASE IF NOT EXISTS proyecto1;
USE proyecto1;

CREATE TABLE IF NOT EXISTS uso_cpu_ram (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_vm VARCHAR(4),
    porcentaje_ram INT,
    porcentaje_cpu INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
);