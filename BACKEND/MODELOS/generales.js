const { sequelize, QueryTypes } = require('../conexion-bd');

async function consultarCanal(req, res) {
    await sequelize.query(`SELECT * FROM Canal`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarInteres(req, res) {
    await sequelize.query(`SELECT * FROM interes`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarCargo(req, res) {
    await sequelize.query(`SELECT * FROM cargo`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarPerfilesUsuarios(req, res) {
    await sequelize.query(`SELECT * FROM perfil`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarPreferencia(req, res) {
    await sequelize.query(`SELECT * FROM preferencia`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarCanalesContacto(req, res) {
    await sequelize.query(`SELECT * FROM contacto_canal
    INNER JOIN canal on contacto_canal.CANA_Id = canal.CANA_Id
    INNER JOIN preferencia on contacto_canal.PREFE_Id = preferencia.PREF_Id
    WHERE CONTA_Id = ${req.params.id}`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

module.exports = {
    consultarCanal,
    consultarInteres,
    consultarCargo,
    consultarPerfilesUsuarios,
    consultarPreferencia,
    consultarCanalesContacto
};