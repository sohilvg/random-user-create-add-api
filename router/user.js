const express = require('express');
const router = express.Router();

const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:sk@96877@localhost:5432/orm_demo'); /*connection to database using sequelize*/


const User = sequelize.define('users', {
    name: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    gender: Sequelize.STRING,
    birthday: Sequelize.DATE,
    city: Sequelize.STRING,
    country: Sequelize.STRING,

});

router.get('/', (req, res, next) => {
    res.send('ok');
})




/*3. for add user manually to database (sequelize)*/

router.post('/api/v1/randomuser/manual', function (req, res) {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile,
        city: req.body.city,
        gender: req.body.gender,
        country: req.body.country,
        birthday: req.body.birthday
    }).then(function (result) {
        res.json(result);
    });
})


/*4. api for get user data from database */

router.get('/api/v1/randomuser/all', function (req, res) {
    User.findAll({}).then(function (result) {
        res.json(result);
    })
});

/*5. api for update the user data stored in database*/

router.put('/api/v1/randomuser/:id', function (req, res) {
    User.update({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.phone,
        city: req.body.city,
        gender: req.body.gender,
        country: req.body.country,
        birthday: req.body.birthday
    }, {
        where: {
            id: req.params.id
        }
    }).then(function (result) {
        res.json(result);
    })
})

/*6. api for delete user from database*/

router.delete('/api/v1/randomuser/:id', function (req, res) {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(function (result) {
        res.json(result);
    })
})

module.exports = router