const { Sequelize, DataTypes } = require("sequelize");
const { QueryTypes } = require('sequelize');

const sequelize = new Sequelize("bddatawarehouse", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

sequelize.sync({ force: false })
    .then(() => { console.log("Tablas sincronizadas"); })
    .catch((e) => { console.log("Ha ocurrido un error", e); });

module.exports = {
    sequelize,
    DataTypes,
    QueryTypes
}