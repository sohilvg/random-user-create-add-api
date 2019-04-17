const express = require('express');
const router = express.Router();
const Request = require("request");
const prom = require('request-promise-native');
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
/* 1. api for get random user from randomuser-api*/

router.get('/api/v1/randomuser', (req, res, next) => {

    const option = {
        uri: 'https://randomuser.me/api/',
        qs: {
            results: req.query.count,
            page: req.query.page,
            nat: req.query.nationality,
            exc: req.query.excluded,
            gender: req.query.gender,
            inc: req.query.included

        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    prom(option)
        .then(function (upass) {
            console.log('User has %d upass', upass.length);
            return res.status(200).send({
                status: 'SUCCESS',
                data: upass.results
            });
        })
        .catch(function (err) {
            // API call failed...
            console.error(err.message)
            return res.status(443).send({
                status: 'Failure',

            });
        });
});

/*1.1 used to sort the data of randomuser */

const orderby = function (data, order_by) {

    return data.order_by(function (a, b) {
        const x = a[order_by].toLowerCase();
        const y = b[order_by].toLowerCase();
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
}

/*2. api to add the randomuser data to database*/

router.post('/api/v1/randomuser', (req, res, next) => {

    const option = {
        uri: 'https://randomuser.me/api/',
        qs: {
            results: req.query.count,
            page: req.query.page,
            nat: req.query.nationality,
            exc: req.query.excluded,
            gender: req.query.gender,
            inc: req.query.included
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    prom(option)
        .then(async function (upass) {
            const randomUser = upass.results;

            const userdata = randomUser.map((User) => {
                return {
                    // id: User.id,
                    name: User.name.first,
                    username: User.login.username,
                    email: User.email,
                    password: User.login.password,
                    birthday: User.dob.date,
                    gender: User.gender,
                    city: User.location.city,
                    // state: User.location.state,
                    country: User.nat,
                    mobile: User.phone,
                };
            });
            console.log('upass $(JSON.stringify(userdata))');
            const insertQuery = User.bulkCreate(userdata).then(function (result) {
                    res.json(result);
                })
                .then(users => {
                    console.log(users) // ... in order to get the array of user objects
                })

            console.log(' $(JSON.stringify(insertQuery.toSQL()))');
            const result = await insertQuery;
            return res.status(200).send({
                status: 'SUCCESS',
                data: result
            });
        })
        .catch(function (err) {
            // API call failed...
            console.error(err.message)
            return res.status(443).send({
                status: 'Failure',

            });
        });
})

/*2.1 used to sort the data of randomuser */

const sortby = function (data, sort_by) {

    return data.sort_by(function (a, b) {
        const x = a[sort_by].toLowerCase();
        const y = b[sort_by].toLowerCase();
        if (x < y) {
            return -1;
        }
        if (x > y) {
            return 1;
        }
        return 0;
    });
}
module.exports = router