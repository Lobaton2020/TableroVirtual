drop database if exists tablerovirtual;
CREATE DATABASE tablerovirtual;
use tablerovirtual;

CREATE TABLE tablero (
idtablero int not null auto_increment,
contenidotablero longtext,
usuario varchar(100) not null,
contrasena varchar(200) not null,
identificacion varchar(100) not null,
fechatablero datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
primary key(idtablero)
);

         