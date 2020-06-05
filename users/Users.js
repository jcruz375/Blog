const sequelize = require('sequelize');
const connection = require('../database/database');

const Users = connection.define('Users',{
    email:{
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type:sequelize.STRING,
        allowNull: false
    },
    apelido: {
        type:sequelize.STRING,
        allowNull: false
    }
});

Users.sync({force: false})


module.exports = Users;