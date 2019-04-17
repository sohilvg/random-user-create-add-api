const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyparser = require('body-parser');
const routes = require('./router/user.js');
const randomroutes = require('./router/user_routes.js');

/* setting up the env config*/
dotenv.config({
    path:'./env'
});

app.use(bodyparser.json());
app.use(routes);
app.use(randomroutes);

app.listen(6060, () => {
    console.log(`server is running on ${process.env.NODE_ENV}on port 6060`);
});