const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();
const jwt = require('jsonwebtoken');
const firma = 'D4T4.W4r3h0us32021+.';

server.listen(3000, () => { console.log("Servidor puerto 3000"); });
server.get('/', function (req, res) { res.send('Data Warehouse! Nicol Endo Ruiz'); });
server.use(bodyParser.json());
server.use(cors());

const contactos = require("./MODELOS/contactos");
const usuarios = require("./MODELOS/usuarios");
const regiones = require("./MODELOS/regiones");
const companias = require("./MODELOS/companias");
const ciudades = require("./MODELOS/ciudades");
const generales = require("./MODELOS/generales");
const paises = require("./MODELOS/paises");

//Middlewares
function validacionAdministrador(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const tokenVerify = jwt.verify(token, firma);
        if (tokenVerify) {
            if (tokenVerify.datosUsuario[0].PERF_Id == 1) {
                return next()
            } else {
                res.status(401).send('No puede realizar la acción, sólo puede realizarla usuario con rol administrador')
            }
        }
    } catch (err) {
        res.status(400).send('Ha ocurrido un error al validar el usuario');
    }
};
function validarUsuarioLog(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const tokenVerify = jwt.verify(token, firma)
        if (tokenVerify) {
            req.user = tokenVerify;
            return next()
        } else {
            res.status(401).send('Ha ocurrido un error al validar la sesión del usuario')
        }
    } catch (err) {
        res.status(400).send('Ha ocurrido un error al validar el usuario');
    }
}

//Gestión contactos
server.get('/contactos', validarUsuarioLog, contactos.consultarContactos);
server.get('/contactos/:id', validarUsuarioLog, contactos.consultarContacto)
server.post("/contactos/", validarUsuarioLog, contactos.crearContacto);
server.post("/obtenercontactos/", validarUsuarioLog, contactos.ObtenerContactos);
server.put("/contactos/:id", validarUsuarioLog, contactos.modificarContacto);
server.delete("/contactos/:id", validarUsuarioLog, contactos.eliminarContacto);

//Gestión de usuarios
server.get("/usuarios", validarUsuarioLog, usuarios.consultarUsuarios);
server.get('/usuarios/:id', validarUsuarioLog, usuarios.consultarUsuario)
server.post("/usuarios/login", usuarios.iniciarSesion);
server.post("/usuarios/", validacionAdministrador, usuarios.crearUsuario);
server.put("/usuarios/:id", validacionAdministrador, usuarios.modificarUsuario);
server.delete("/usuarios/:id", validacionAdministrador, usuarios.eliminarUsuario);

//Gestión de generales
server.get("/interes", validarUsuarioLog, generales.consultarInteres);
server.get("/cargo", validarUsuarioLog, generales.consultarCargo);
server.get("/perfil", validarUsuarioLog, generales.consultarPerfilesUsuarios);
server.get("/canal", validarUsuarioLog, generales.consultarCanal);
server.get("/canal/:id", validarUsuarioLog, generales.consultarCanalesContacto);
server.get("/preferencia", validarUsuarioLog, generales.consultarPreferencia);

//Gestión de regiones
server.get("/regiones", validarUsuarioLog, regiones.consultarRegiones);
server.post("/regiones/", validarUsuarioLog, regiones.crearRegion);
server.put("/regiones/:id", validarUsuarioLog, regiones.modificarRegion);
server.delete("/regiones/:id", validarUsuarioLog, regiones.eliminarRegion);

//Gestión de ciudades
server.get("/ciudades", validarUsuarioLog, ciudades.consultarCiudades);
server.post("/ciudades/", validarUsuarioLog, ciudades.crearCiudad);
server.put("/ciudades/:id", validarUsuarioLog, ciudades.modificarCiudad);
server.delete("/ciudades/:id", validarUsuarioLog, ciudades.eliminarCiudad);

//Gestión de paises
server.get("/paises", validarUsuarioLog, paises.consultarPaises);
server.post("/paises/", validarUsuarioLog, paises.crearPais);
server.put("/paises/:id", validarUsuarioLog, paises.modificarPais);
server.delete("/paises/:id", validarUsuarioLog, paises.eliminarPais);

//Gestión de companias
server.get("/companias", validarUsuarioLog, companias.consultarCompanias);
server.get('/companias/:id', validarUsuarioLog, companias.consultarCompania)
server.post("/companias/", validarUsuarioLog, companias.crearCompania);
server.put("/companias/:id", validarUsuarioLog, companias.modificarCompania);
server.delete("/companias/:id", validarUsuarioLog, companias.eliminarCompania);