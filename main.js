// declaracion de variables
var imgBoard = document.getElementById("img-result-board");
var imgViewer = document.getElementById("img-result-viewer");

var seccionMain = document.getElementById("seccion-main");
var seccionBoard = document.getElementById("seccion-board");
var seccionViewer = document.getElementById("seccion-viewer");

var contenidoBoardUsuario = document.getElementById("contenido-board-usuario");
var nameUsuario = document.getElementById("name-usuario");
var codigoViewer = document.getElementById("codigo-viewer");
var fechaBoardUsuario = document.getElementById("fecha-board-usuario");
var codigoUsuario = document.getElementById("codigo-usuario");

var tableroRecibe = document.getElementById("tablero-recibe");
var fechaRecibe = document.getElementById("fecha-recibe");
var codigoRecibe = document.getElementById("codigo-recibe");

var regresar = document.getElementById("regresar");
var body = document.getElementById("body");

var cerrarSesion = document.getElementById("cerrar-sesion");
var alertNuevoUsuario = document.getElementById("alerta-nuevo-usuario");
var alertVerificarUsuario = document.getElementById("alerta-verificar-usuario");

var pinIngreso = document.getElementById("pin-ingreso");
var validarPin = document.getElementById("validar-pin");
var errorPin = document.getElementById("error-pin");

var actualizarUsuarioBoton = document.getElementById("actualizar-usuario");
var editarUsuarioBoton = document.getElementById("editar-usuario-z");
var habilitarBody = document.getElementById("habilitar-body");
var passActualizar = document.getElementById("pass-usuario-actualizar");
var usuarioActualizar = document.getElementById("nombre-usuario-actualizar");
var alertusuarioActualizar = document.getElementById("alert-update-user");

var usuario = "";
var contador = 0;
var identificacion = "";
var localdb = this.localStorage;

var crearUsuario = document.getElementById("crear-usuario");
var nombreNuevoUsuario = document.getElementById("nombre-usuario");
var passNuevoUsuario = document.getElementById("pass-usuario");

window.addEventListener("load", function() {
    var verificarUsuario = document.getElementById("verificar-usuario");
    var nombreVerificarUsuario = document.getElementById("usuario-verificar");
    var passVerificarUsuario = document.getElementById("pass-usuario-verificar");

    if (
        localdb.getItem("identificacion") !== "" &&
        JSON.parse(localdb.getItem("session")) === true
    ) {
        seccionBoard.className = "";
        body.style.background = "#cccccc";

        codigoUsuario.innerHTML = localdb.getItem("identificacion");
        nameUsuario.innerHTML = localdb.getItem("usuario");
        contenidoBoardUsuario.value = localdb.getItem("contenido");
        fechaBoardUsuario.innerHTML = localdb.getItem("fecha");

        llamadoEventos();
        // ---------------------------------------------------------------------------------------------------
    } else if (JSON.parse(localdb.getItem("viewer")) === true) {
        var pin = localdb.getItem("pin");
        seccionViewer.className = "";
        body.style.background = "#227f9f";
        setInterval(function() {
            datosRecibeServidor(pin);
        }, 1000);
    } else {
        seccionMain.className = "";
        body.style.background = "#20bf6b";
    }
    actualizarUsuarioBoton.addEventListener("click", function() {
        $("#options").modal("hide");
        $("#update-user").modal("show");

        usuarioActualizar.value = localdb.getItem("usuario");
    });
    editarUsuarioBoton.addEventListener("click", function() {
        if (usuarioActualizar.value === "" || passActualizar.value === "") {
            alertusuarioActualizar.innerHTML = mostrarAlerta(
                "Ingresa un valor",
                "danger"
            );
        } else {
            var user = usuarioActualizar.value,
                pass = passActualizar.value,
                id = localdb.getItem("identificacion");

            httpActualizarUsuario(user, pass, id);
        }
    });
    regresar.addEventListener("click", function() {
        localdb.clear();
        window.location.href = "index.html";
    });

    pinIngreso.addEventListener("keyup", function(e) {
        if (this.value > 99999) {
            validarPin.removeAttribute("disabled");
        } else {
            validarPin.setAttribute("disabled", "");
        }
    });

    validarPin.addEventListener("click", function() {
        var pin = pinIngreso.value;
        setInterval(function() {
            datosRecibeServidor(pin);
        }, 1000);
    });

    cerrarSesion.addEventListener("click", function() {
        localdb.clear();
        window.location.href = "index.html";
    });
    crearUsuario.addEventListener("click", function(e) {
        if (nombreNuevoUsuario.value === "" || passNuevoUsuario.value === "") {
            alertNuevoUsuario.innerHTML = mostrarAlerta("Ingresa un valor", "danger");
        } else {
            var user = nombreNuevoUsuario.value,
                pass = passNuevoUsuario.value;
            httpcrearUsuario(user, pass);
        }
    });
    passVerificarUsuario.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            if (
                nombreVerificarUsuario.value === "" ||
                passVerificarUsuario.value === ""
            ) {
                alertVerificarUsuario.innerHTML = mostrarAlerta(
                    "No has escrito nada",
                    "danger"
                );
            } else {
                var user = nombreVerificarUsuario.value,
                    pass = passVerificarUsuario.value;
                httpValidarUsuario(user, pass);
            }
        }
    });
    verificarUsuario.addEventListener("click", function(e) {
        if (
            nombreVerificarUsuario.value === "" ||
            passVerificarUsuario.value === ""
        ) {
            alertVerificarUsuario.innerHTML = mostrarAlerta(
                "No has escrito nada",
                "danger"
            );
        } else {
            var user = nombreVerificarUsuario.value,
                pass = passVerificarUsuario.value;
            httpValidarUsuario(user, pass);
        }
    });
});

function llamadoEventos() {
    contenidoBoardUsuario.addEventListener("paste", function(e) {
        enviarDatosServidor(this, e);
    });
    contenidoBoardUsuario.addEventListener("cut", function(e) {
        enviarDatosServidor(this, e);
    });
    contenidoBoardUsuario.addEventListener("keyup", function(e) {
        enviarDatosServidor(this, e);
    });
}
// no repeticion de la llamada a interval

// Funciones de ajax
// ajax envio datos servidor
function enviarDatosServidor(that, event) {
    if (
        localdb.getItem("identificacion") !== "" &&
        JSON.parse(localdb.getItem("session")) === true
    ) {
        that.value = that.value.replace(/&&/gi, "and");
        that.value = that.value.replace(/&/gi, "|ERROR-HERE|");

        var parametros =
            "contenido=" +
            that.value +
            "&identificacion=" +
            localdb.getItem("identificacion");

        var http = getXMLHttpRequest();
        http.open("POST", "proceso.php", true);
        http.onreadystatechange = procesoEnvioDatos;
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        http.send(parametros);
    } else {
        seccionBoard.className = "d-none";
        seccionMain.className = "";
        body.style.background = "#20bf6b";
        localdb.clear();
    }
}

function procesoEnvioDatos() {
    if (this.readyState == 4) {
        imgBoard.style.display = "";
        if (this.status == 200) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            if (response) {
                imgBoard.src = "img/true.png";

                localdb.setItem("session", "true");
                localdb.setItem("identificacion", response.identificacion);
                localdb.setItem("usuario", response.usuario);
                localdb.setItem("contenido", response.contenidotablero);
                localdb.setItem("fecha", getDatetime(response.fechatablero));
            } else {
                imgBoard.src = "img/false.png";
            }
        }
    }
}
// fin

// recibir datos servidor
function datosRecibeServidor(identificacion) {
    var http = getXMLHttpRequest();
    http.open("GET", "proceso.php?identificacion=" + identificacion, true);
    http.onreadystatechange = procesoRecibidaDatos;
    http.send(null);
    return http;
}

function procesoRecibidaDatos() {
    if (this.readyState == 4) {
        imgViewer.style.display = "";
        if (this.status == 200) {
            imgViewer.style.display = "none";
            var response = JSON.parse(this.responseText);

            if (response) {
                errorPin.innerHTML = "";
                seccionMain.className = "d-none";
                seccionViewer.className = "";
                body.style.background = "#227f9f";
                tableroRecibe.value = response.contenidotablero;
                fechaRecibe.innerHTML = getDatetime(response.fechatablero);
                codigoRecibe.innerHTML = response.identificacion;
                tableroRecibe.style.height = tableroRecibe.scrollHeight + "px";
                if (contador == 0) {
                    contador++;
                    localdb.setItem("viewer", "true");
                    localdb.setItem("pin", response.identificacion);
                }
            } else {
                seccionMain.className = "";
                errorPin.innerHTML = "El pin es incorrecto";
                seccionViewer.className = "d-none";
                body.style.background = "#20bf6b";
                localdb.clear();
            }
        }
    }
}
// fin

// verificar usuario
function httpValidarUsuario(user, pass) {
    var parametros = "validacion=true&usuario=" + user + "&pass=" + pass;
    var http = getXMLHttpRequest();
    http.open("POST", "proceso.php", true);
    http.onreadystatechange = procesoVerificarUsuario;
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send(parametros);
}

function procesoVerificarUsuario() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response) {
                $("#ingreso").modal("hide");
                seccionMain.className = "d-none";
                seccionBoard.className = "";
                body.style.background = "#cccccc";

                codigoUsuario.innerHTML = response.identificacion;
                nameUsuario.innerHTML = response.usuario;
                contenidoBoardUsuario.value = response.contenidotablero;
                fechaBoardUsuario.innerHTML = getDatetime(response.fechatablero);

                localdb.setItem("session", "true");
                localdb.setItem("identificacion", response.identificacion);
                localdb.setItem("usuario", response.usuario);
                localdb.setItem("contenido", response.contenidotablero);
                localdb.setItem("fecha", getDatetime(response.fechatablero));

                llamadoEventos();
            } else {
                alertVerificarUsuario.innerHTML = mostrarAlerta(
                    "Error de autenticacion",
                    "primary"
                );
            }
        }
    }
}

// fin
// proceso crear usuario
function httpcrearUsuario(user, pass) {
    var parametros =
        "createuser=" +
        user +
        "&createpass=" +
        pass +
        "&identificacion=" +
        getRandomInt(100000, 999999);
    var http = getXMLHttpRequest();
    http.open("POST", "proceso.php", true);
    http.onreadystatechange = procesoCrearUsuario;
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send(parametros);
}

function procesoCrearUsuario() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response) {
                alertNuevoUsuario.innerHTML = mostrarAlerta(
                    "El usuario se ha creado.",
                    "success"
                );
                nombreNuevoUsuario.value = "";
                passNuevoUsuario.value = "";

                $("#newuser").modal("hide");
                $("#ingreso").modal("show");
            } else {
                alertNuevoUsuario.innerHTML = mostrarAlerta(
                    "El usuario no esta disponible.",
                    "primary"
                );
            }
        }
    }
}

// fin
// proceso crear usuario
function httpActualizarUsuario(user, pass, id) {
    var parametros =
        "updateuser=" + user + "&updatepass=" + pass + "&identificacion=" + id;
    var http = getXMLHttpRequest();
    http.open("POST", "proceso.php", true);
    http.onreadystatechange = procesoActualizarUsuario;
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send(parametros);
}

function procesoActualizarUsuario() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            var response = JSON.parse(this.responseText);

            if (response) {
                alertusuarioActualizar.innerHTML = mostrarAlerta(
                    "El usuario se ha actualizado.",
                    "success"
                );
                nombreNuevoUsuario.value = "";
                passNuevoUsuario.value = "";
            } else {
                alertusuarioActualizar.innerHTML = mostrarAlerta(
                    "El usuario no se pudo actualizar.",
                    "danger"
                );
            }
        }
    }
}

// Funciones de todo
function getXMLHttpRequest() {
    var req;
    try {
        req = new XMLHttpRequest();
    } catch (err1) {
        try {
            req = ActiveXObject("Msxml2.XMLHTTP");
        } catch (err2) {
            try {
                req = ActiveXObject("Microsoft.XMLHTTP");
            } catch (err3) {
                return false;
            }
        }
    }
    return req;
}

function getDatetime(fecha) {
    var datetime = new Date(fecha),
        ano = datetime.getFullYear(),
        dia = datetime.getDate(),
        fecha = "",
        hour = "",
        minutos = datetime.getMinutes(),
        segundos = datetime.getSeconds(),
        mes = new Array(),
        hora = new Array();
    mes = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];
    hora = [
        12,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
    ];

    var meridiano = datetime.getHours() >= 12 ? " pm" : " am";
    fecha = mes[datetime.getMonth()] + " " + dia + " " + ano;
    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;
    hour = hora[datetime.getHours()] + ":" + minutos + ":" + segundos + meridiano;
    return fecha + " - " + hour;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function mostrarAlerta(mensaje, tipo) {
    var texto = "";
    texto +=
        '  <div  class="alert alert-' +
        tipo +
        ' alert-dismissible fade show " role="alert" >';
    texto += mensaje;
    texto += '  <button type="button" class="close"';
    texto += '    data-dismiss="alert"';
    texto += '    aria-label="Close" >';
    texto += '    <span aria-hidden="true">&times;</span>';
    texto += "  </button>";
    texto += "</div>";

    return texto;
}