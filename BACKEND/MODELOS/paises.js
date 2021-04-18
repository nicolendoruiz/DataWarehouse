const { sequelize, QueryTypes } = require('../conexion-bd');

async function consultarPaises(req, res) {
    await sequelize.query(`SELECT * FROM Pais`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function crearPais(req, res) {
    await sequelize.query(`INSERT INTO Pais (PAIS_Nombre,REGI_Id) 
    VALUES (:PAIS_Nombre,:REGI_Id)`,
        { replacements: req.body })
        .then(result => console.log(result) || res.status(200).json('El país se ha registrado correctamente.'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function modificarPais(req, res) {
    await sequelize.query(`UPDATE Pais SET PAIS_Nombre='${req.body.PAIS_Nombre}' WHERE PAIS_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.SET })
        .then(result => console.log(result) || res.status(200).json('La información se ha actualizado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function eliminarPais(req, res) {
    sequelize.query(`DELETE FROM ciudad WHERE PAIS_Id = ${req.params.id}`, { type: sequelize.QueryTypes.DELETE })
    sequelize.query(`DELETE FROM Pais WHERE PAIS_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.DELETE })
        .then(result => console.log(result) || res.status(200).json('El país se ha eliminado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

module.exports = {
    consultarPaises,
    crearPais,
    modificarPais,
    eliminarPais
};