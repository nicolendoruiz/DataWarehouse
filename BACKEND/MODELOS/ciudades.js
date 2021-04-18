const { sequelize, QueryTypes } = require('../conexion-bd');

async function consultarCiudades(req, res) {
    await sequelize.query(`SELECT * FROM Ciudad`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function crearCiudad(req, res) {
    await sequelize.query(`INSERT INTO Ciudad (CIUD_Nombre,PAIS_Id) 
    VALUES (:CIUD_Nombre,:PAIS_Id)`,
        { replacements: req.body })
        .then(result => console.log(result) || res.status(200).json('La ciudad se ha registrado correctamente.'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function modificarCiudad(req, res) {
    await sequelize.query(`UPDATE Ciudad SET CIUD_Nombre='${req.body.CIUD_Nombre}',PAIS_Id='${req.body.PAIS_Id}' WHERE CIUD_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.SET })
        .then(result => console.log(result) || res.status(200).json('La información se ha actualizado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function eliminarCiudad(req, res) {
    await sequelize.query(`DELETE FROM Ciudad WHERE CIUD_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.DELETE })
        .then(result => console.log(result) || res.status(200).json('La ciudad se ha eliminado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};


module.exports = {
    consultarCiudades,
    crearCiudad,
    modificarCiudad,
    eliminarCiudad
};