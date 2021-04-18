const { sequelize, QueryTypes } = require('../conexion-bd');

async function consultarRegiones(req, res) {
    await sequelize.query(`SELECT * FROM region
    LEFT JOIN pais ON pais.regi_id = region.regi_id
    LEFT JOIN ciudad ON ciudad.pais_id = pais.pais_id`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function crearRegion(req, res) {
    await sequelize.query(`INSERT INTO region (REGI_Nombre) 
    VALUES (:REGI_Nombre)`,
        { replacements: req.body })
        .then(result => console.log(result) || res.status(200).json('La región se ha registrado correctamente.'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function modificarRegion(req, res) {
    await sequelize.query(`UPDATE region SET REGI_Nombre='${req.body.REGI_Nombre}' WHERE REGI_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.SET })
        .then(result => console.log(result) || res.status(200).json('La información se ha actualizado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function eliminarRegion(req, res) {
    await sequelize.query(`DELETE FROM region WHERE REGI_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.DELETE })
        .then(result => console.log(result) || res.status(200).json('La región se ha eliminado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};


module.exports = {
    consultarRegiones,
    crearRegion,
    modificarRegion,
    eliminarRegion
};