const fs = require('fs');
require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

const Tour = require('./../../models/tourModel');

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

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//   import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded!');
  } catch (err) {
    console.log('error import data', err);
  }
  process.exit();
};

// run command line
// to import data to db
// node ./dev-data/data/import-dev-data.js --import

// to delete data from db
// node ./dev-data/data/import-dev-data.js --delete

// delete data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data successfull deleted!');
  } catch (err) {
    console.log('error deleting data', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
