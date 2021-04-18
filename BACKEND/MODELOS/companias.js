const { sequelize, QueryTypes } = require('../conexion-bd');

async function consultarCompanias(req, res) {
    await sequelize.query(`SELECT * FROM compania 
            INNER JOIN ciudad ON compania.CIUD_Id=ciudad.CIUD_Id
            INNER JOIN pais ON ciudad.PAIS_Id=pais.PAIS_Id`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarCompania(req, res) {
    await sequelize.query(`SELECT * FROM compania 
            INNER JOIN ciudad ON compania.CIUD_Id=ciudad.CIUD_Id
            INNER JOIN pais ON ciudad.PAIS_Id=pais.PAIS_Id
            WHERE COMP_Id=${req.params.id}`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function crearCompania(req, res) {
    await sequelize.query(`INSERT INTO compania(COMP_Nombre, COMP_Direccion, COMP_Correo, COMP_Telefono, COMP_Estado, CIUD_Id) 
    VALUES (:COMP_Nombre, :COMP_Direccion,:COMP_Correo, :COMP_Telefono, :COMP_Estado, :CIUD_Id)`,
        { replacements: req.body })
        .then(result => console.log(result) || res.status(200).json('La compañia se ha registrado correctamente.'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function modificarCompania(req, res) {
    await sequelize.query(`UPDATE compania SET COMP_Nombre='${req.body.COMP_Nombre}',COMP_Direccion='${req.body.COMP_Direccion}',COMP_Correo='${req.body.COMP_Correo}',COMP_Telefono='${req.body.COMP_Telefono}',COMP_Estado ='${req.body.COMP_Estado}',CIUD_Id=${req.body.CIUD_Id} WHERE COMP_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.SET })
        .then(result => console.log(result) || res.status(200).json('La información se ha actualizado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function eliminarCompania(req, res) {
    await sequelize.query(`DELETE FROM compania WHERE COMP_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.DELETE })
        .then(result => console.log(result) || res.status(200).json('La compañía se ha eliminado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

module.exports = {
    consultarCompanias,
    consultarCompania,
    crearCompania,
    modificarCompania,
    eliminarCompania
};