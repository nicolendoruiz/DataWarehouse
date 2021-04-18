const { sequelize, QueryTypes } = require('../conexion-bd');
const jwt = require('jsonwebtoken');
const firma = 'D4T4.W4r3h0us32021+.';

async function consultarUsuarios(req, res) {
    await sequelize.query(`SELECT *,IF(USUA_Estado = 1, "Activo", "Inactivo") as USUA_DescripcionEstado
            FROM usuario INNER JOIN perfil ON usuario.PERF_Id=perfil.PERF_Id`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarUsuario(req, res) {
    await sequelize.query(`SELECT *,IF(USUA_Estado = 1, "Activo", "Inactivo") as USUA_DescripcionEstado
            FROM usuario INNER JOIN perfil ON usuario.PERF_Id=perfil.PERF_Id
            WHERE USUA_Id=${req.params.id}`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function crearUsuario(req, res) {
    await sequelize.query(`INSERT INTO usuario(USUA_Nombres, USUA_Apellidos, USUA_Correo, USUA_Contrasenia, USUA_Estado, PERF_Id) 
    VALUES (:USUA_Nombres, :USUA_Apellidos,:USUA_Correo, :USUA_Contrasenia, :USUA_Estado, :PERF_Id)`,
        { replacements: req.body })
        .then(result => console.log(result) || res.status(200).json('El usuario se ha registrado correctamente.'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function modificarUsuario(req, res) {
    await sequelize.query(`UPDATE usuario SET USUA_Nombres='${req.body.USUA_Nombres}',USUA_Apellidos='${req.body.USUA_Apellidos}',USUA_Correo='${req.body.USUA_Correo}',USUA_Contrasenia='${req.body.USUA_Contrasenia}',USUA_Estado ='${req.body.USUA_Estado}',PERF_Id=${req.body.PERF_Id} WHERE usua_id = ${req.params.id}`,
        { type: sequelize.QueryTypes.SET })
        .then(result => console.log(result) || res.status(200).json('La información se ha actualizado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function eliminarUsuario(req, res) {
    await sequelize.query(`DELETE FROM usuario WHERE usua_id = ${req.params.id}`,
        { type: sequelize.QueryTypes.DELETE })
        .then(result => console.log(result) || res.status(200).json('El usuario se ha eliminado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function iniciarSesion(req, res) {
    const correoUsuario = req.body.correo;
    const contraUsuario = req.body.contrasenia;
    let datosUsuario = await sequelize.query(`SELECT USUA_Id, USUA_Correo, USUA_Contrasenia,PERF_Id FROM usuario WHERE USUA_Correo="${correoUsuario}"`,
        { type: sequelize.QueryTypes.SELECT });
    if (JSON.stringify(datosUsuario) !== '[]') {
        if (datosUsuario[0].USUA_Contrasenia == contraUsuario) {
            const token = jwt.sign({ datosUsuario }, firma);
            res.json({ token });
        } else {
            res.status(400).send('Información inválida, usuario o contraseña incorrectos.')
        }
    } else {
        res.status(400).send('Información inválida, no se ha encontrado un usuario con los datos ingresados.')
    }
};

module.exports = {
    consultarUsuarios,
    consultarUsuario,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
    iniciarSesion
};