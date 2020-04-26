<?php

date_default_timezone_set('America/Bogota');

$dbhost = "localhost";
$dbuser = "root";
$dbpassword = "";
$dbname = "tablerovirtual";

$con = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);
// Actualizacion del tablero
if (isset($_POST["contenido"]) && isset($_POST["contenido"])) {

    $contenido = analisis($con, $_POST["contenido"]);
    $identificacion = analisis($con, $_POST["identificacion"]);

    $fecha = date("Y-m-d H:i:s");
    $sql = "UPDATE tablero SET contenidotablero = '{$contenido}' , fechatablero = '{$fecha}' WHERE identificacion = {$identificacion}";
    if (mysqli_query($con, $sql)) {
        $result = mysqli_query($con, "SELECT * FROM tablero WHERE identificacion = '{$identificacion}'");
        $response = mysqli_fetch_assoc($result);
        if ($response) {
            echo json_encode($response);
        } else {
            echo "false";
        }
    } else {
        echo "false";
    }
}

// optener texto
if (isset($_GET["identificacion"]) && !empty($_GET["identificacion"])) {
    $result = mysqli_query($con, "SELECT * FROM tablero WHERE identificacion = '{$_GET["identificacion"]}'");
    $response = mysqli_fetch_assoc($result);
    if ($response) {
        echo json_encode($response);
    } else {
        echo "false";
    }
}
// validacion de usuario o log in
if (isset($_POST["validacion"]) && !empty($_POST["validacion"])) {

    $user = analisis($con, $_POST["usuario"]);

    $result = mysqli_query($con, "SELECT * FROM tablero WHERE usuario = '{$user}'");
    $response = mysqli_fetch_assoc($result);

    if ($response) {
        if (password_verify(analisis($con, $_POST["pass"]), $response["contrasena"])) {
            echo json_encode($response);
        } else {
            echo "false";
        }
    } else {
        echo "false";
    }
}
// creacion del usuario
if (isset($_POST["createuser"]) && !empty($_POST["createuser"])) {

    $user = analisis($con, $_POST["createuser"]);
    $pass = password_hash(analisis($con, $_POST["createpass"]), PASSWORD_BCRYPT);
    $identity = analisis($con, $_POST["identificacion"]);
    $texto = "Bienvenido {$user}, Aqui podras poner el texto que quieras y compartirlo con quien quieras.. Con tan solo compartir el pin de arriba.";

    $sqlConsulta = "SELECT * FROM tablero WHERE usuario = '{$user}'";
    $sqlIngreso = "INSERT INTO tablero(contenidotablero,usuario,contrasena,identificacion) VALUES('{$texto}','{$user}','{$pass}','{$identity}')";

    $userRepeat = mysqli_query($con, $sqlConsulta);
    if (mysqli_num_rows($userRepeat) > 0) {
        echo "false";
    } else {
        if (mysqli_query($con, $sqlIngreso)) {
            echo "true";
        } else {
            echo "false";
        }
    }
}

// actualizar datos de usuario
if (isset($_POST["updateuser"]) && !empty($_POST["updateuser"])) {
    $user = analisis($con, $_POST["updateuser"]);
    $pass = password_hash(analisis($con, $_POST["updatepass"]), PASSWORD_BCRYPT);
    $id = analisis($con, $_POST["identificacion"]);

    $result = mysqli_query($con, "UPDATE tablero SET usuario = '{$user}',contrasena = '{$pass}' WHERE identificacion = {$id}");
    if ($result) {
        echo "true";
    } else {
        echo "false";
    }
}

function analisis($conexion, $string)
{
    return mysqli_real_escape_string($conexion, $string);
}
