const express = require("express");
require("dotenv").config();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const TOURS_ENDPOINT = '/api/v1/tours';
const USERS_ENDPOINT = '/api/v1/users';


const app = express();

app.use(TOURS_ENDPOINT, tourRouter);
app.use(USERS_ENDPOINT, userRouter);

module.exports = app;