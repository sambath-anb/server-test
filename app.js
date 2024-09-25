const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
// serve static files
app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const TOURS_ENDPOINT = '/api/v1/tours';
const USERS_ENDPOINT = '/api/v1/users';

app.use(TOURS_ENDPOINT, tourRouter);
app.use(USERS_ENDPOINT, userRouter);

module.exports = app;
