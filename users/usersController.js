const express = require('express');
const router = express.Router();
const Users = require('./Users');
const bcrypt = require('bcryptjs');
const Category = require('../categories/Category');
const adminAuth = require('../middlewares/adminAuth');


router.get('/admin/users',adminAuth, (req, res) => {
    Users.findAll().then(users => {
        res.render('admin/users/users', { users: users });
    })
});
router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create');
});
router.post('/users/create', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var apelido = req.body.apelido;

    Users.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            Users.create({
                email: email,
                password: hash,
                apelido: apelido,
            }).then(() => {
                res.redirect('/admin/users');
            }).catch(err => {
                res.redirect('/');
            })

        } else {
            res.redirect('/admin/users/create');
        };
    });
});

router.post('/users/delete', (req, res) => {
    var id = req.body.id;

    if (id != undefined) {
        if(!isNaN(id)){
            Users.destroy({where: {id: id}}).then(() => {
                res.redirect('/admin/users');
            });
        } else {
            res.redirect('/admin/users');
        };
    } else {
        res.redirect('/admin/users');
    };
});

router.get('/login', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/users/login', {categories: categories});
    })
});

router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    Users.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            var correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                    email: user.email,
                    id: user.id
                }

                res.redirect('/admin/users');

            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    })
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/')
});

module.exports = router;