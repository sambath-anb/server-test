require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

// local database
// const DB = process.env.DATABASE_LOCAL;

// access hosted database
const DB = process.env.DATABASE.replace(
  '<USERNAME>',
  process.env.DATABASE_USERNAME
).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful');
  });

const app = require('./app');

// check running environment
console.log(app.get('env'));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listen on port ${port}`);
});

// Handle mongoose connection error
// DEPRECIATED
process.on('unhandledRejection', (reason, promise) => {
  console.log('UnhandledRejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exception error
process.on('uncaughtException', (reason, promise) => {
  console.log('UncaughtException at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// This code will raise uncaught exception
// console.log(x);
