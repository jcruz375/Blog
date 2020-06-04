const sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category')

const Article = connection.define('Articles',{
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type:sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    },
    
});


Article.belongsTo(Category); //um artigo para uma categoria(pertence)
Category.hasMany(Article);

module.exports = Article;