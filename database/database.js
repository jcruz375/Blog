const sequelize = require('sequelize');
const connection = new sequelize('bancoblog', 'j.cruz01', 'U.LiAS6DqSxM#sm', {
    host: 'mysql669.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection