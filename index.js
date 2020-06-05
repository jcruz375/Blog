//Modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

//Controllers
const categoriesController = require('./categories/categoriesController');
const articlesController = require('./articles/articlesController');
const usersController = require('./users/usersController');

//Models
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const Users = require('./users/Users');

//view engine
app.set('view engine', 'ejs');

//sessions
app.use(session({
    secret: 'fdhdfvdophewffwpoefheeu',
    cookie: {maxAge: 3600000}
}))

//static
app.use(express.static('public'));

//body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso');
    })
    .catch((error) => {
        console.log(error);
    });

//Routes
app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC'],
            
        ],
        limit: 3
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories });

        })
    });
});

app.get('/articles/:slug', (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', { article: article, categories: categories });
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Article.findAll({
                where: {
                    CategoryId: category.id
                }
            }).then(articles => {
                Category.findAll().then(categories => {
                    var teste = category.articles
                    res.render('catArticles', { articles: articles, categories: categories })
                })

            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
});

//getting controllers
app.use('/', categoriesController);
app.use('/', articlesController);
app.use('/', usersController);

//server

app.listen(2020, (error) => {
    if (error) {
        console.log(error, 'Server não iniciado');
    } else {
        console.log('Servidor iniciado com sucesso!')
    }
});