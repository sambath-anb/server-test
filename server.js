require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

// local database
// const DB = process.env.DATABASE_LOCAL;

// hosted database
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
    console.log(con.connections);
    console.log('DB connection successful');
  });

const app = require('./app');

// check running environment
console.log(app.get('env'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
