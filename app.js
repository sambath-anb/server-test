const express = require('express');
const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// serve static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const TOURS_ENDPOINT = '/api/v1/tours';
const USERS_ENDPOINT = '/api/v1/users';

app.use(TOURS_ENDPOINT, tourRouter);
app.use(USERS_ENDPOINT, userRouter);

// handle unspecified route
// MUST PUT AT THE BOTTOM
// app.all('*', (req, res, next) => {
//   // res.status(404).json({
//   //   status: 'fail',
//   //   message: `Can't find ${req.originalUrl} on the server`,
//   // });

//   // const err = new Error(`Can't find ${req.originalUrl} on the server`);
//   // err.statusCode = 404;
//   // err.status = 'fail';
//   // next(err);

//   next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
// });

app.use(globalErrorHandler);

module.exports = app;
