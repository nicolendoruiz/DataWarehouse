const { sequelize, QueryTypes } = require('../conexion-bd');

async function consultarContactos(req, res) {
    await sequelize.query(`SELECT * FROM contacto
        INNER JOIN compania ON contacto.COMP_Id=compania.COMP_Id
        INNER JOIN ciudad ON contacto.CIUD_Id=ciudad.CIUD_Id
        INNER JOIN pais ON ciudad.PAIS_Id=pais.PAIS_Id
        INNER JOIN region ON pais.REGI_Id=region.REGI_Id
        INNER JOIN cargo ON contacto.CARG_Id=cargo.CARG_Id
        INNER JOIN interes ON contacto.INTE_Id=interes.INTE_Id`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function consultarContacto(req, res) {
    await sequelize.query(`SELECT * FROM contacto
        INNER JOIN compania ON contacto.COMP_Id=compania.COMP_Id
        INNER JOIN ciudad ON contacto.CIUD_Id=ciudad.CIUD_Id
        INNER JOIN pais ON ciudad.PAIS_Id=pais.PAIS_Id
        INNER JOIN region ON pais.REGI_Id=region.REGI_Id
        INNER JOIN cargo ON contacto.CARG_Id=cargo.CARG_Id
        INNER JOIN interes ON contacto.INTE_Id=interes.INTE_Id
        WHERE CONT_Id=${req.params.id}`,
        { type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result));
};

async function ObtenerContactos(req, res) {
    await sequelize.query(`SELECT * FROM contacto
    INNER JOIN compania ON contacto.COMP_Id=compania.COMP_Id
    INNER JOIN ciudad ON contacto.CIUD_Id=ciudad.CIUD_Id
    INNER JOIN pais ON ciudad.PAIS_Id=pais.PAIS_Id
    INNER JOIN region ON pais.REGI_Id=region.REGI_Id
    INNER JOIN cargo ON contacto.CARG_Id=cargo.CARG_Id
    INNER JOIN interes ON contacto.INTE_Id=interes.INTE_Id
        WHERE contacto.CONT_Nombre LIKE '%${req.body.parametro}%' 
        OR compania.COMP_Nombre LIKE '%${req.body.parametro}%' 
        OR ciudad.CIUD_Nombre LIKE '%${req.body.parametro}%' 
        OR pais.PAIS_Nombre LIKE '%${req.body.parametro}%' 
        OR region.REGI_Nombre LIKE '%${req.body.parametro}%'`,{ type: QueryTypes.SELECT })
        .then(result => res.status(200).json(result))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'));
};

async function crearContacto(req, res) {
    await sequelize.query(`INSERT INTO contacto(CONT_Nombre, CONT_Apellido, CONT_Correo, CONT_Direccion,CONT_Estado, CIUD_Id, COMP_Id,INTE_Id,CARG_Id) 
    VALUES (:CONT_Nombre, :CONT_Apellido, :CONT_Correo, :CONT_Direccion,:CONT_Estado, :CIUD_Id, :COMP_Id, :INTE_Id, :CARG_Id)`,
        { replacements: req.body })
        .then((result) => {
            req.body.CANALES.forEach(CANAL => {
                idContacto = JSON.stringify(result[0]);
                sequelize.query(`INSERT INTO contacto_canal(CANA_Id, CONTA_Id, PREFE_Id,CONCA_Cuentausuario,CONCA_Estado) VALUES (${CANAL.CANA_Id},${JSON.stringify(result[0])},${CANAL.PREFE_Id},'${CANAL.CONCA_Cuentausuario}',1)`)
            })
        })
        .then(result => console.log(result) || res.status(200).json('El contacto se ha registrado correctamente.'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

async function eliminarContacto(req, res) {
    sequelize.query(`DELETE FROM contacto WHERE CONT_id = ${req.params.id}`, { type: sequelize.QueryTypes.DELETE })
    sequelize.query(`DELETE FROM contacto_canal WHERE CONTA_id = ${req.params.id}`, { type: sequelize.QueryTypes.DELETE })
        .then(result => (console.log(result)) || res.status(200).json(`El contacto No.${req.params.id} se ha eliminado correctamente`))
        .catch(error => console.log(error) || res.status(400).send('Información inválida, intente nuevamente.'))

};

async function modificarContacto(req, res) {
    await sequelize.query(`UPDATE contacto SET CONT_Nombre='${req.body.CONT_Nombre}',CONT_Apellido='${req.body.CONT_Apellido}',CONT_Correo='${req.body.CONT_Correo}',CONT_Direccion='${req.body.CONT_Direccion}',CONT_Estado=${req.body.CONT_Estado},CIUD_Id=${req.body.CIUD_Id},COMP_Id=${req.body.COMP_Id},INTE_Id=${req.body.INTE_Id},CARG_Id=${req.body.CARG_Id} WHERE CONT_Id = ${req.params.id}`,
        { type: sequelize.QueryTypes.SET })
        .then(result => console.log(result) || res.status(200).json('La información se ha actualizado correctamente'))
        .catch(err => console.log(err) || res.status(400).send('Información inválida, intente nuevamente.'))
};

module.exports = {
    consultarContactos,
    consultarContacto,
    crearContacto,
    modificarContacto,
    eliminarContacto,
    ObtenerContactos
};