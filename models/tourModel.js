const mongoose = require('mongoose');

// define schema
const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Tour must have a name!'],
      unique: true,
    },
    rating: {
      type: Number,
      default: 4.0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price!'],
    },
  });
  
  // create tour model
  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;